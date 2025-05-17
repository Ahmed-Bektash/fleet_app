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
import { ICreateMission, IMissionDataHandler } from "./missionTypes";
import { v4 as uuidv4 } from "uuid";
export class CreateMissionUseCase implements BaseUseCase<ICreateMission> {
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

  async execute(request: ICreateMission): Promise<Result> {
    try {
      //authenticate the vehicle
      const auth = await authVehicle(
        request.token,
        request.vehicle_id,
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
      //parse the message
      const data: Omit<
        Mission,
        | "created_at"
        | "updated_at"
        | "deleted_at"
        | "is_deleted"
        | "mission_end_time"
        | "mission_actual_start_time"
      > = {
        id: uuidv4(),
        vehicle_id: request.vehicle_id,
        mission_description: request.mission_description,
        mission_type: request.mission_type,
        mission_planned_start_time: request.mission_start_time,
        mission_location: request.mission_location,
        mission_status: E_MissionStatus.PENDING,
      };

      //send the mission to the vehicle
      const pub_res = await this.messageClient.publish(
        `${E_TOPICS.MISSION}/${request.vehicle_id}`,
        JSON.stringify(data),
        {
          qos: E_QOS.AT_LEAST_ONCE,
        }
      );
      if (!pub_res) {
        return {
          state: false,
          data: null,
          error: {
            code: E_HttpResponseStatus.SERVER_ERROR,
            message: "Internal server error",
            details: "Failed to publish mission to the vehicle",
          },
        };
      }
      const creation = await this.missionDataHandler.createMission(data);

      return creation;
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
}
