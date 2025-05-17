import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
import { E_QOS, E_TOPICS } from "../../shared/types/businessTypes";
import { E_MissionStatus, Mission } from "../../shared/types/entities/mission";
import {
  BaseUseCase,
  E_HttpResponseStatus,
  Result,
} from "../../shared/types/generalTypes";
import { authVehicle } from "../../shared/utils/authVehcile";
import { IVehicleDataHandler } from "../vehicle/vehicleTypes";
import { IReceiveMissionStatus, IMissionDataHandler } from "./missionTypes";
export class ReceiveMissionStatusUseCase
  implements BaseUseCase<IReceiveMissionStatus>
{
  private readonly vehicleDataHandler: IVehicleDataHandler;
  private readonly missionDataHandler: IMissionDataHandler;
  private readonly messageClient: IMqttClient;
  constructor(
    vehicleDataHandler: IVehicleDataHandler,
    missionDataHandler: IMissionDataHandler,
    messageClient: IMqttClient
  ) {
    this.vehicleDataHandler = vehicleDataHandler;
    this.missionDataHandler = missionDataHandler;
    this.messageClient = messageClient;
  }

  async execute(message: IReceiveMissionStatus): Promise<Result> {
    try {
      //authenticate the vehicle
      const auth = await authVehicle(
        message.token,
        message.vehicle_id,
        this.vehicleDataHandler,
        this.messageClient
      );
      if (!auth.state) {
        return {
          state: false,
          data: null,
          error: {
            code: E_HttpResponseStatus.UNAUTHORIZED,
            message: "Unauthorized",
            details: auth.error?.details,
          },
        };
      }

      //check if the mission exists
      const mission_data = await this.missionDataHandler.getMissionById(
        message.mission_id
      );
      if (!mission_data.state) {
        return {
          state: false,
          data: null,
          error: {
            code: E_HttpResponseStatus.NOT_FOUND,
            message: "Mission not found",
            details: mission_data.error?.details,
          },
        };
      }
      const mission = mission_data.data;
      //parse the message
      const data: Partial<Mission> | null = this.getMissionStrategy(
        message,
        mission
      );

      if (data) {
        if (data.mission_status === E_MissionStatus.CANCELLED) {
          
            const pub_res = await this.messageClient.publish(
            `${E_TOPICS.MISSION_CANCEL}/${message.mission_id}`,
            JSON.stringify({
              status: E_MissionStatus.CANCELLED,
              timestamp: message.timestamp,
            }),
            {
              qos: E_QOS.AT_LEAST_ONCE,
            }
          );
            if (!pub_res) {

                //TODO: handle error
                return {
                state: false,
                data: null,
                error: {
                    code: E_HttpResponseStatus.SERVER_ERROR,
                    message: "Failed to publish cancellation message",
                    details: "Failed to publish cancellation message",
                },
                };
            }
        }
        //if no action is needed do not needlessly call the database
        const creation = await this.missionDataHandler.updateMission(
          message.mission_id,
          data
        );
        return creation;
      }
    } catch (error) {
      return {
        state: false,
        error: {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "Internal server error",
          details: error.message,
        },
      };
    }
  }

  private PendingMissionStrategy(
    inputData: IReceiveMissionStatus,
    current_mission: Mission
  ): Partial<Mission> {
    // Check if the mission is already accepted
    if (
      current_mission.mission_status === E_MissionStatus.COMPLETED &&
      inputData.timestamp > current_mission.updated_at
    ) {
      //cant be pending after being completed
      // may recieve duplicate messages with pending after it has been started so that can pass
      return {
        mission_status: E_MissionStatus.CANCELLED,
        mission_end_time: Date.now(),
      };
    }
    // there should be no action needed since the mission is already pending
    return null;
  }
  private AcceptedMissionStrategy(
    inputData: IReceiveMissionStatus,
    current_mission: Mission
  ): Partial<Mission> {
    if (current_mission.mission_status === E_MissionStatus.PENDING) {
      return {
        mission_status: E_MissionStatus.ACCEPTED,
        mission_actual_start_time: inputData.timestamp,
      };
    }
  }

  private CompletedMissionStrategy(
    inputData: IReceiveMissionStatus,
    current_mission: Mission
  ): Partial<Mission> {
    if (inputData.timestamp < current_mission.mission_planned_start_time) {
      return {
        mission_status: E_MissionStatus.FAILED,
        mission_end_time: inputData.timestamp,
      };
    }
    if (current_mission.mission_status === E_MissionStatus.IN_PROGRESS) {
      return {
        mission_status: E_MissionStatus.COMPLETED,
        mission_end_time: inputData.timestamp,
      };
    }
    if (
      current_mission.mission_status === E_MissionStatus.CANCELLED ||
      current_mission.mission_status === E_MissionStatus.FAILED ||
      current_mission.mission_status === E_MissionStatus.REJECTED
    ) {
      return {
        mission_status: E_MissionStatus.FAILED,
        mission_end_time: inputData.timestamp,
      };
    }
  }
  private FailedMissionStrategy(
    inputData: IReceiveMissionStatus,
    current_mission: Mission
  ): Partial<Mission> {
    //observability:handle logging
    console.log(
      `[Mission failed]: ${current_mission.id}, at: ${
        inputData.timestamp
      }: ${JSON.stringify(inputData.vehicle_details)}`
    );
    return {
      mission_status: E_MissionStatus.FAILED,
      mission_end_time: inputData.timestamp,
    };
  }

  private RejectedMissionStrategy(
    inputData: IReceiveMissionStatus,
    current_mission: Mission
  ): Partial<Mission> {
    console.log(
      `[Mission rejected]: ${current_mission.id}, at: ${
        inputData.timestamp
      }: ${JSON.stringify(inputData.vehicle_details)}`
    );
    // can only reject a mission if it is pending
    if (current_mission.mission_status === E_MissionStatus.PENDING) {
      return {
        mission_status: E_MissionStatus.REJECTED,
        mission_end_time: inputData.timestamp,
      };
    }
    return null;
  }

  private CancelledMissionStrategy(
    inputData: IReceiveMissionStatus,
    current_mission: Mission
  ): Partial<Mission> {
    //vehicles cannot cancel missions
    //handle error
    console.log(
      `[Mission cancelled by vehicle]: ${current_mission.id}, at: ${
        inputData.timestamp
      }: ${JSON.stringify(inputData.vehicle_details)}`
    );

    return null;
  }
  private InProgressMissionStrategy(
    inputData: IReceiveMissionStatus,
    current_mission: Mission
  ): Partial<Mission> {
    if (inputData.timestamp < current_mission.mission_planned_start_time) {
      return {
        mission_status: E_MissionStatus.CANCELLED,
        mission_end_time: inputData.timestamp,
      };
    }
    if (
      current_mission.mission_status === E_MissionStatus.ACCEPTED &&
      inputData.timestamp > current_mission.mission_planned_start_time
    ) {
      return {
        mission_status: E_MissionStatus.IN_PROGRESS,
        mission_actual_start_time: inputData.timestamp,
      };
    }
    return null;
  }
  private getMissionStrategy(
    inputData: IReceiveMissionStatus,
    current_mission: Mission
  ): Partial<Mission> {
    const missionStrategies = {
      [E_MissionStatus.PENDING]: this.PendingMissionStrategy,
      [E_MissionStatus.ACCEPTED]: this.AcceptedMissionStrategy,
      [E_MissionStatus.COMPLETED]: this.CompletedMissionStrategy,
      [E_MissionStatus.FAILED]: this.FailedMissionStrategy,
      [E_MissionStatus.REJECTED]: this.RejectedMissionStrategy,
      [E_MissionStatus.CANCELLED]: this.CancelledMissionStrategy,
      [E_MissionStatus.IN_PROGRESS]: this.InProgressMissionStrategy,
    };
    const strategy = missionStrategies[inputData.status as E_MissionStatus];
    if (!strategy) {
      throw new Error("Invalid mission status");
    }
    return missionStrategies[inputData.status as E_MissionStatus](
      inputData,
      current_mission
    );
  }
}
