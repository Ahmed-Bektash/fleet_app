import { MQTTServiceFactory } from "../../Infrastructure/mqtt/mqttServiceFactory";
import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
import { E_QOS, E_TOPICS } from "../../shared/types/businessTypes";
import { RegisterVehicleUseCase } from "./registerVehicleUseCase";
import { UpdateVehicleUseCase } from "./updateVehicleUseCase";
import { VehicleDataHandler } from "./vehicleDataHandler";
import { IRegisterVehicle, IUpdateVehicle } from "./vehicleTypes";

export class VehicleServiceFactory {

  /**
   * @requires: to be called during the application startup
   * @description: this method will create a subscriber to the vehicle register topic
   */
  public async makeRegisterVehicleSubscriber(messageClient:IMqttClient) {
 
      const subscribe = await messageClient.subscribe(
        E_TOPICS.VEHICLE_REGISTER,
        { qos: E_QOS.AT_LEAST_ONCE },
        this.registerVehicleSubscriberCallback
      );
      return subscribe;
  }
  
  public async makeVehicleHealthSubscriber(messageClient:IMqttClient) {
      const subscribe = await messageClient.subscribe(
        E_TOPICS.VEHICLE_HEALTH,
        { qos: E_QOS.AT_LEAST_ONCE },
        this.vehicleHealthCallback
      );
      return subscribe;
  }

  /**
   * 
   * @param topic the topic to infer response topic from
   * @param message the message to be broken down for registration details
   * @description: this method will be called when a message is received on the vehicle register topic
   *                and register a vehicle in the db
   */
  public async registerVehicleSubscriberCallback(
    topic: string,
    message: Buffer<ArrayBufferLike>
  ): Promise<void> {
    const registerVehicleRequestAdapter = (
    topic: string,
    message: Buffer<ArrayBufferLike>
  ): IRegisterVehicle => {
    const messageString = message.toString();
    const messageJson = JSON.parse(messageString) as IRegisterVehicle['message'];
    //TODO: validate the messageJson
     return{
      topic: topic,
      message: messageJson,
    };
  };
    try {
      const messageClient = new MQTTServiceFactory().makeMqttService();
      const usecase = await new RegisterVehicleUseCase(
        VehicleDataHandler.getInstance(),
        messageClient
      ).execute(registerVehicleRequestAdapter(topic, message));

      if (!usecase.state) {
        // handle error here
      }
    } catch (error) {
      console.error("Error in registerVehicle:", error);
    }
  }
 
  public async vehicleHealthCallback(
    topic: string,
    message: Buffer<ArrayBufferLike>
  ): Promise<void> {
    const updateVehicleRequestAdapter = (
    topic: string,
    message: Buffer<ArrayBufferLike>
  ): IUpdateVehicle => {
    const messageString = message.toString();
    const messageJson = JSON.parse(messageString) as IUpdateVehicle;
    //TODO: validate the messageJson
     return messageJson;
  };
    try {
      const messageClient = new MQTTServiceFactory().makeMqttService();
      const usecase = await new UpdateVehicleUseCase(
        VehicleDataHandler.getInstance(),
        messageClient
      ).execute(updateVehicleRequestAdapter(topic, message));

      if (!usecase.state) {
        // handle error here
      }
    } catch (error) {
      console.error("Error in registerVehicle:", error);
    }
  }


}
