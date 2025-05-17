import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
import { E_QOS } from "../../shared/types/businessTypes";
import { E_VehicleStatus } from "../../shared/types/entities/vehicle";
import {
  BaseUseCase,
  E_HttpResponseStatus,
  Result,
} from "../../shared/types/generalTypes";
import { IRegisterVehicle, IVehicleDataHandler } from "./vehicleTypes";
import * as jsonwebtoken from "jsonwebtoken";
export class RegisterVehicleUseCase implements BaseUseCase<IRegisterVehicle> {
  private readonly vehicleDataHandler: IVehicleDataHandler;
  private readonly messageClient: IMqttClient;
  constructor(
    vehicleDataHandler: IVehicleDataHandler,
    messageClient: IMqttClient
  ) {
    this.vehicleDataHandler = vehicleDataHandler;
    this.messageClient = messageClient;
  }

  async execute(request: IRegisterVehicle): Promise<Result> {
    const topic = request.topic.toString();
    const message = request.message;
    const { clientId, fleetId, model, oem, vehicleType, vin, year } = message;
    try {
      let result: Result;
      //check if the vehcile is already registered
      const vehicle = await this.vehicleDataHandler.getVehicleByVin(vin);
      if (vehicle.state && vehicle.data) {
        //if the vehicle is already registered, just update its status to ready
        const vehicleId = vehicle.data.id;
        const updateVehicleResult =
          await this.vehicleDataHandler.updateVehicleData(vehicleId, {
            vehicle_client_id: clientId,
            vehicle_status: E_VehicleStatus.READY,
          });
        result = this.handleResult(updateVehicleResult);
        result.data = vehicleId;
      } else {
        const registerVehicleResult =
          await this.vehicleDataHandler.registerVehicle(
            clientId,
            fleetId,
            vin,
            vehicleType,
            oem,
            model,
            year
          );
        result = this.handleResult(registerVehicleResult);
      }
      //check if the registration was successful
      if (result.data && result.state) {
        // get the token from the result
        const token = jsonwebtoken.sign(
          { vehicleId: result.data }, //vehicleId
          process.env.JWT_SECRET,
          { expiresIn: "1D" }
        );

        //publish the message to the mqtt broker
        const publishTopic = `${topic}/response/${clientId}`;
        const publishResult = await this.messageClient.publish(
          publishTopic,
          token,
          { qos: E_QOS.AT_LEAST_ONCE }
        );
        if (publishResult) {
          result.state = true;
          result.data = null;
          result.error = null;
        } else {
          throw new Error("Failed to publish vehicle registration response");
        }
      } else {
        throw new Error("Failed to register vehicle");
      }

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
      throw new Error(result.error?.message || "Internal server error");
    }
  }
}
