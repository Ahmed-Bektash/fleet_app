import { MQTTServiceFactory } from "../../Infrastructure/mqtt/mqttServiceFactory";
import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
import { E_QOS, E_TOPICS } from "../../shared/types/businessTypes";
import { VehicleDataHandler } from "../vehicle/vehicleDataHandler";
import { AddTelemetryUseCase } from "./addTelemetryUseCase";
import { TelemetryDataHandler } from "./telemetryDataHandler";
import { ITelemetryMessage } from "./telemetryTypes";


export class TelemetryServiceFactory {

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
      return subscribe;
  }


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
    const addTelemetryRequestAdapter = (
    topic: string,
    message: Buffer<ArrayBufferLike>
  ): ITelemetryMessage => {
    const messageString = message.toString();
    const messageJson = JSON.parse(messageString) as ITelemetryMessage;
    //TODO: validate the messageJson
     return messageJson;
  };
    try {
      const messageClient = new MQTTServiceFactory().makeMqttService();
      const usecase = await new AddTelemetryUseCase(
        TelemetryDataHandler.getInstance(),
        VehicleDataHandler.getInstance(),
        messageClient,
      ).execute(addTelemetryRequestAdapter(topic, message));

      if (!usecase.state) {
        // TODO: handle error here
      }
    } catch (error) {
      console.error("Error in AddTelemetry:", error);
    }
  }


}
