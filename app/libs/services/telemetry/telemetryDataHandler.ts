
import { TelemetryModel } from "../../Infrastructure/db/models/telemetryModel";
import { ObjectionWrapper } from "../../Infrastructure/db/objectionWrapper";
import { Telemetry } from "../../shared/types/entities/telemetry";
import { E_HttpResponseStatus, Result } from "../../shared/types/generalTypes";
import { ITelemetryDataHandler } from "./telemetryTypes";

export class TelemetryDataHandler
  extends ObjectionWrapper
  implements ITelemetryDataHandler
{
  private static instance: TelemetryDataHandler;

  private constructor() {
    super();
  }

  public static getInstance(): TelemetryDataHandler {
    TelemetryDataHandler.instance ??= new TelemetryDataHandler();
    return TelemetryDataHandler.instance;
  }

  async addTelemetryData(
    data: Omit<
      Telemetry,
      "id" | "created_at" | "updated_at" | "deleted_at" | "is_deleted"
    >[]
  ): Promise<Result<boolean>> { 
    try {
      await TelemetryModel.query().insert(data);
      return {
        state: true,
        data: true,
        error: null,
      };
    } catch (error) {
      return {
        state: false,
        data: null,
        error: {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "data layer error",
          details: error.message,
        },
      };
    }
  }


}
