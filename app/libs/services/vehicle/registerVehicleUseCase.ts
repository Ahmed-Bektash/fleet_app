import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
import { E_QOS } from "../../shared/types/businessTypes";
import { BaseUseCase, E_HttpResponseStatus, Result } from "../../shared/types/generalTypes";
import { IRegisterVehicle, IVehicleDataHandler, REGISTRATION_MESSAGE_LENGTH, VEHICLE_REGISTRATION_BODY_ORDER } from "./vehicleTypes";
import * as jsonwebtoken from 'jsonwebtoken';
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
    try {
        const result:Result = {
            state: false,
            data: null,
            error: null,
        }
     
      
      const message = request.message.toString();
      const topic = request.topic.toString();
      //parse the message: clientId, vin, vehicleType, vehicleModel, OEM
      if(!message.includes("/") || message.split("/").length !== REGISTRATION_MESSAGE_LENGTH){
        result.state = false;
        result.data = null;
        result.error = {
          code: E_HttpResponseStatus.BAD_REQUEST,
          message: "Invalid message format",
          details: "Invalid message format",
        };
        return result;
      }
      const clientId = message.split("/")[VEHICLE_REGISTRATION_BODY_ORDER.clientId];
      const vin = message.split("/")[VEHICLE_REGISTRATION_BODY_ORDER.vin];
      const vehicleType = message.split("/")[VEHICLE_REGISTRATION_BODY_ORDER.vehicleType];
      const vehicleModel = message.split("/")[VEHICLE_REGISTRATION_BODY_ORDER.model];
      const vehicleYear = message.split("/")[VEHICLE_REGISTRATION_BODY_ORDER.year];
      const vehicleOem = message.split("/")[VEHICLE_REGISTRATION_BODY_ORDER.oem];
      //call the vehicle data handler
      const registerVehicleResult = await this.vehicleDataHandler.registerVehicle(
        clientId,
        vin,
        vehicleType,
        vehicleOem,
        vehicleModel,
        vehicleYear
      );
      //check if the registration was successful
      if (registerVehicleResult.state && registerVehicleResult.data) {
        // get the token from the result
        const token = jsonwebtoken.sign(
          { clientId: clientId },
          process.env.JWT_SECRET,
          { expiresIn: "1D" },
          
        );
        
        //publish the message to the mqtt broker
        const publishTopic = `${topic}/response/${clientId}`;
        const publishResult = await this.messageClient.publish(
          publishTopic,
          token,
          { qos: E_QOS.AT_LEAST_ONCE}
        );
        if (publishResult) {
          result.state = true;
          result.data = null;
          result.error = null;
        } else {
          result.state = false;
          result.data = null;
          result.error = {
            code: E_HttpResponseStatus.SERVER_ERROR,
            message: "Failed to publish message to MQTT broker",
            details: "Failed to publish message to MQTT broker",
          };
        }
      } else {
        result.state = false;
        result.data = null;
        result.error = {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "Failed to register vehicle",
          details: registerVehicleResult.error?.message,
        };
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

  
}