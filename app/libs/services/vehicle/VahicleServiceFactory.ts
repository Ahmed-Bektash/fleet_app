import { MQTTServiceFactory } from "../../Infrastructure/mqtt/mqttServiceFactory";
import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
import { E_QOS, E_TOPICS } from "../../shared/types/businessTypes";
import { RegisterVehicleUseCase } from "./registerVehicleUseCase";
import { VehicleDataHandler } from "./vehicleDataHandler";
import { IRegisterVehicle } from "./vehicleTypes";

export class VehicleServiceFactory {
  private readonly vehicleDataHandler = VehicleDataHandler.getInstance();

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
      if (!subscribe) {
        //TODO: fail gracefully
        console.error(
          "Failed to subscribe to topic:",
          E_TOPICS.VEHICLE_REGISTER
        );
      }
  }
  
  public async makeVehicleHealthSubscriber(messageClient:IMqttClient) {
      const subscribe = await messageClient.subscribe(
        E_TOPICS.VEHICLE_HEALTH,
        { qos: E_QOS.AT_LEAST_ONCE },
        this.vehicleHealthCallback
      );
      if (!subscribe) {
        //TODO: fail gracefully
        console.error(
          "Failed to subscribe to topic:",
          E_TOPICS.VEHICLE_REGISTER
        );
      }
  }


  private readonly registerVehicleRequestAdapter = (
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
    try {
      const messageClient = MQTTServiceFactory.makeMqttService();
      const usecase = await new RegisterVehicleUseCase(
        this.vehicleDataHandler,
        messageClient
      ).execute(this.registerVehicleRequestAdapter(topic, message));

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
    try {
      const messageClient = MQTTServiceFactory.makeMqttService();
      const usecase = await new RegisterVehicleUseCase(
        this.vehicleDataHandler,
        messageClient
      ).execute(this.registerVehicleRequestAdapter(topic, message));

      if (!usecase.state) {
        // handle error here
      }
    } catch (error) {
      console.error("Error in registerVehicle:", error);
    }
  }


}
