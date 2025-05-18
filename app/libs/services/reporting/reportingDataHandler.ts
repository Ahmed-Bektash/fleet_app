import { MissionModel } from "../../Infrastructure/db/models/missionModel";
import { ObjectionWrapper } from "../../Infrastructure/db/objectionWrapper";
import { Result } from "../../shared/types/generalTypes";
import { IReportingDataHandler, MissionsReport } from "./reportingTypes";

export class ReportingDataHandler
  extends ObjectionWrapper
  implements IReportingDataHandler
{
  private static instance: ReportingDataHandler;
  private constructor() {
    super();
  }
  public static getInstance(): ReportingDataHandler {
    ReportingDataHandler.instance ??= new ReportingDataHandler();
    return ReportingDataHandler.instance;
  }
  public async getMissionsReport(
    start_time_ms?: number,
    end_time_ms?: number,
    limit?: number,
    offset?: number
  ): Promise<Result<MissionsReport[]>> {
    const result: Result<MissionsReport[]> = {
      state: true,
      data: null,
      error: null,
    };
    try {
      const missions_query = MissionModel.query()
        .select(
          "mission.id as mission_id",
          "mission.mission_planned_start_time as planned_start_time",
          "mission.mission_actual_start_time as actual_start_time",
          "mission.mission_end_time as mission_end_time",
          "mission.mission_status as mission_status",
          "vehicle.id as vehicle_id",
          "vehicle.vin as vehicle_vin",
          "vehicle.oem as vehicle_oem",
          "vehicle.model as vehicle_model",
          "vehicle.vehicle_type as vehicle_type",
          "vehicle.vehicle_status as vehicle_status"
        )
        .leftJoin("vehicle", "mission.vehicle_id", "vehicle.id");
      if (start_time_ms) {
        missions_query.where("mission.mission_planned_start_time", ">=", start_time_ms);
      }
      if (end_time_ms) {
        missions_query.where("mission.mission_end_time", "<=", end_time_ms);
      }
      if (limit) {
        missions_query.limit(limit);
      }
      if (offset) {
        missions_query.offset(offset);
      }
      const missions = await missions_query.castTo<MissionsReport[]>();
        
      result.data = missions;
      result.state = true;
      result.error = null;
    } catch (error) {
      result.state = false;
      result.data = null;
      result.error = {
        code: 500,
        message: "fetch from database error",
        details: error.message,
      };
    }
    return result;
  }
}
