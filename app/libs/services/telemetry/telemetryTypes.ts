import {
  Telemetry,
} from "../../shared/types/entities/telemetry";
import { Result } from "../../shared/types/generalTypes";

export interface ITelemetryMessage {
  vehicleId: string;
  telemetryData: {
    [key: string]: string;
  };
  timestamp_ms: number;
  token: string;
}

export interface ITelemetryDataHandler {
  addTelemetryData: (
    data: Omit<
      Telemetry,
      "id" | "created_at" | "updated_at" | "deleted_at" | "is_deleted"
    >[]
  ) => Promise<Result<boolean>>;
}
