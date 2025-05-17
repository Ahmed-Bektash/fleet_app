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
    start_time_ms: number,
    end_time_ms: number,
    limit: number,
    offset: number
  ): Promise<Result<MissionsReport[]>> {
    const result: Result<MissionsReport[]> = {
      state: true,
      data: null,
      error: null,
    };
    try {
      const missions = await MissionModel.query()
        .select(
          "missions.id as mission_id",
          "missions.start_time as mission_start_time",
          "missions.end_time as mission_end_time",
          "missions.status as mission_status",
          "vehicles.id as vehicle_id",
          "vehicles.vin as vehicle_vin",
          "vehicles.oem as vehicle_oem",
          "vehicles.model as vehicle_model",
          "vehicles.type as vehicle_type",
          "vehicles.status as vehicle_status"
        )
        .leftJoin("vehicles", "mission.vehicle_id", "vehicle.id")
        .where("missions.start_time", ">=", start_time_ms)
        .andWhere("missions.end_time", "<=", end_time_ms)
        .limit(limit)
        .offset(offset)
        .castTo<MissionsReport[]>();
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
