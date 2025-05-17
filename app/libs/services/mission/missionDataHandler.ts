import { MissionModel } from "../../Infrastructure/db/models/missionModel";
import { ObjectionWrapper } from "../../Infrastructure/db/objectionWrapper";
import { Mission } from "../../shared/types/entities/mission";
import { E_HttpResponseStatus, Result } from "../../shared/types/generalTypes";
import { IMissionDataHandler } from "./missionTypes";

export class MissionDataHandler
  extends ObjectionWrapper
  implements IMissionDataHandler
{
  private static instance: MissionDataHandler;

  private constructor() {
    super();
  }

  public static getInstance(): MissionDataHandler {
    MissionDataHandler.instance ??= new MissionDataHandler();
    return MissionDataHandler.instance;
  }

  async createMission(
    data: Omit<
      Mission,
      | "created_at"
      | "updated_at"
      | "deleted_at"
      | "is_deleted"
      | "mission_end_time"
      | "mission_actual_start_time"
    >
  ): Promise<Result<string>> {
    try {
      const mission = await MissionModel.query().insert({
        ...data,
      });
      return {
        state: true,
        data: mission.id,
        error: null,
      };
    } catch (error) {
      return {
        state: false,
        data: null,
        error: {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "Internal server error",
          details: error.message,
        },
      };
    }
  }

  async getMissionById(id: string): Promise<Result<Mission>> {
    try {
      const mission = await MissionModel.query().findById(id);
      if (mission) {
        return {
          state: true,
          data: mission,
          error: null,
        };
      } else {
        return {
          state: false,
          data: null,
          error: {
            code: E_HttpResponseStatus.NOT_FOUND,
            message: "Mission not found",
            details: `Mission with id ${id} not found`,
          },
        };
      }
    } catch (error) {
      return {
        state: false,
        data: null,
        error: {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "Internal server error",
          details: error.message,
        },
      };
    }
  }

  async updateMission(
    id: string,
    data: Partial<Mission>
  ): Promise<Result<string>> {
    try {
      const updatedMission = await MissionModel.query().updateAndFetchById(
        id,
        data
      );
      if (!updatedMission) {
        return {
          state: false,
          data: null,
          error: {
            code: E_HttpResponseStatus.NOT_FOUND,
            message: "Mission not found",
            details: "Mission not found",
          },
        };
      }
      return {
        state: true,
        data: id,
        error: null,
      };
    } catch (error) {
      return {
        state: false,
        data: null,
        error: {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "Internal server error",
          details: error.message,
        },
      };
    }
  }
}
