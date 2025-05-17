import { ClientPublishOptionsInterface, ClientSubscribeOptionsInterface, IMqttClient } from "./mqttTypes";

export class MqttService implements IMqttClient {
  private readonly mqttAdapter: IMqttClient;
  constructor(mqttAdapter: IMqttClient) {
    this.mqttAdapter = mqttAdapter;
  }

  async connect(): Promise<boolean> {
    // Connect to MQTT Broker
    try {
      const connection  = await this.mqttAdapter.connect();
      return connection;
    } catch (error) {
      console.error(`Error connecting to MQTT broker: ${error}`);
      return false;
    }
  }

  // Publish MQTT Message
  async publish(topic: string, message: string, options: ClientPublishOptionsInterface):Promise<boolean> {
    const publish_res = await this.mqttAdapter.publish(topic, message, options);
    return publish_res;
  }

  // Subscribe to MQTT Message
  async subscribe(topic: string, options: ClientSubscribeOptionsInterface, OnMessageCallback: (topic: string, message: Buffer<ArrayBufferLike>) => void):Promise<boolean>{
    const ret = await this.mqttAdapter.subscribe(topic, options, OnMessageCallback);
    return ret;
  }

  async close() {
    await this.mqttAdapter.close();
  }
}
