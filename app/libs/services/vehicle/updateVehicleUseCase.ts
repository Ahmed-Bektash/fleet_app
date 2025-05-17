import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
import {
  BaseUseCase,
  E_HttpResponseStatus,
  Result,
} from "../../shared/types/generalTypes";
import { authVehicle } from "../../shared/utils/authVehcile";
import { IUpdateVehicle, IVehicleDataHandler } from "./vehicleTypes";

export class UpdateVehicleUseCase implements BaseUseCase<IUpdateVehicle> {
  private readonly vehicleDataHandler: IVehicleDataHandler;
  private readonly messageClient: IMqttClient;
  constructor(
    vehicleDataHandler: IVehicleDataHandler,
    messageClient: IMqttClient
  ) {
    this.vehicleDataHandler = vehicleDataHandler;
    this.messageClient = messageClient;
  }

  async execute(message: IUpdateVehicle): Promise<Result> {
    try {
      //auth vehicle
      const auth = await authVehicle(
        message.token,
        message.id,
        this.vehicleDataHandler,
        this.messageClient
      );
      if (auth.state) {
        const { id, data } = message;
        const result = await this.vehicleDataHandler.updateVehicleData(id, {
          vehicle_status: data.vehicle_status,
          vehicle_client_id: data.vehicle_client_id,
          updated_at: Date.now(),
        });
        if (result.state) {
          return {
            state: true,
            data: result.data,
            error: null,
          };
        } else {
            //TODO: handle errors
          return {
            state: false,
            data: null,
            error: {
              code: E_HttpResponseStatus.SERVER_ERROR,
              message: "Internal server error",
              details: result.error?.details,
            },
          };
        }
      }
    } catch (error) {
      return {
        state: false,
        data: null,
        error: {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "Internal server error",
          details: error,
        },
      };
    }
  }
}
