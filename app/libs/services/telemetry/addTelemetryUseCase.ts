import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
import {
  BaseUseCase,
  E_HttpResponseStatus,
  Result,
} from "../../shared/types/generalTypes";
import { IVehicleDataHandler } from "../vehicle/vehicleTypes";
import { ITelemetryDataHandler, ITelemetryMessage } from "./telemetryTypes";
import {
  E_TelemetryType,
  Telemetry,
} from "../../shared/types/entities/telemetry";
import { authVehicle } from "../../shared/utils/authVehcile";
export class AddTelemetryUseCase implements BaseUseCase<ITelemetryMessage> {
  private readonly TelemetryDataHandler: ITelemetryDataHandler;
  private readonly VehicleDataHandler: IVehicleDataHandler;
  private readonly messageClient: IMqttClient;
  constructor(
    TelemetryDataHandler: ITelemetryDataHandler,
    VehicleDataHandler: IVehicleDataHandler,
    messageClient: IMqttClient
  ) {
    this.TelemetryDataHandler = TelemetryDataHandler;
    this.messageClient = messageClient;
    this.VehicleDataHandler = VehicleDataHandler;
  }

  async execute(message: ITelemetryMessage): Promise<Result> {
    try {
      let result: Result;
      //authenticate the vehicle
      const auth = await authVehicle(
        message.token.split(" ")[1],
        message.vehicleId,
        this.VehicleDataHandler,
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
      const data = this.extractTelemetryData(message);
      const Telemetry = await this.TelemetryDataHandler.addTelemetryData(data);
      this.handleResult(Telemetry);
      return result;
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

  private handleResult(result: Result): Result {
    if (result.state) {
      return {
        state: true,
        data: result.data,
        error: null,
      };
    } else {
      return {
        state: false,
        data: null,
        error: result.error,
      };
    }
  }

  private extractTelemetryData(
    telemetryMessage: ITelemetryMessage
  ): Omit<
    Telemetry,
    "id" | "created_at" | "updated_at" | "deleted_at" | "is_deleted"
  >[] {
    const keys = Object.keys(telemetryMessage.telemetryData);
    const telemetryData = keys.map((key) => {
      if (
        telemetryMessage.telemetryData[key] &&
        Object.values(E_TelemetryType).includes(key as E_TelemetryType)
      ) {
        return {
          vehicle_id: telemetryMessage.vehicleId,
          telemetry_type: key as E_TelemetryType,
          telemetry_value: telemetryMessage.telemetryData[key],
          telemetry_timestamp: telemetryMessage.timestamp_ms,
        };
      }
    });
    return telemetryData;
  }
}
