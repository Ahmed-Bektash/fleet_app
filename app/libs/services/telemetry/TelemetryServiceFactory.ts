import { MQTTServiceFactory } from "../../Infrastructure/mqtt/mqttServiceFactory";
import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
import { E_QOS, E_TOPICS } from "../../shared/types/businessTypes";
import { VehicleDataHandler } from "../vehicle/vehicleDataHandler";
import { AddTelemetryUseCase } from "./addTelemetryUseCase";
import { TelemetryDataHandler } from "./telemetryDataHandler";
import { ITelemetryMessage } from "./telemetryTypes";


export class TelemetryServiceFactory {
  private readonly TelemetryDataHandler = TelemetryDataHandler.getInstance();
  private readonly VehicleDataHandler = VehicleDataHandler.getInstance();

  /**
   * @requires: to be called during the application startup
   * @description: this method will create a subscriber to the Telemetry ingestion topic
   */
  public async makeAddTelemetrySubscriber(messageClient:IMqttClient) {
 
      const subscribe = await messageClient.subscribe(
        E_TOPICS.TELEMETRY,
        { qos: E_QOS.AT_MOST_ONCE }, // can handle packet drops
        this.AddTelemetrySubscriberCallback
      );
      if (!subscribe) {
        //TODO: fail gracefully
        console.error(
          "Failed to subscribe to topic:",
          E_TOPICS.TELEMETRY
        );
      }
  }


  private readonly addTelemetryRequestAdapter = (
    topic: string,
    message: Buffer<ArrayBufferLike>
  ): ITelemetryMessage => {
    const messageString = message.toString();
    const messageJson = JSON.parse(messageString) as ITelemetryMessage;
    //TODO: validate the messageJson
     return messageJson;
  };

  /**
   * 
   * @param topic the topic to infer response topic from
   * @param message the message to be broken down for registration details
   * @description: this method will be called when a message is received on the Telemetry topic
   */
  public async AddTelemetrySubscriberCallback(
    topic: string,
    message: Buffer<ArrayBufferLike>
  ): Promise<void> {
    try {
      const messageClient = MQTTServiceFactory.makeMqttService();
      const usecase = await new AddTelemetryUseCase(
        this.TelemetryDataHandler,
        this.VehicleDataHandler,
        messageClient,
      ).execute(this.addTelemetryRequestAdapter(topic, message));

      if (!usecase.state) {
        // TODO: handle error here
      }
    } catch (error) {
      console.error("Error in AddTelemetry:", error);
    }
  }


}
