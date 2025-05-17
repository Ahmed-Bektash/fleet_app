import mqtt, { IClientOptions, MqttClient } from "mqtt";
import {
  ClientPublishOptionsInterface,
  ClientSubscribeOptionsInterface,
  IMqttClient,
} from "./mqttTypes";
import { v4 as uuidv4 } from 'uuid';
import { E_TOPICS } from "../../shared/types/businessTypes";
export class MqttAdapter implements IMqttClient {
  private mqttClient: MqttClient;
  private readonly host: string;
  // private messageCallback: (
  //   topic: string,
  //   message: Buffer<ArrayBufferLike>
  // ) => void;
  //list of subscribed topics
  private readonly subscribedTopics: {
    [key in E_TOPICS]?:((
    topic: string,
    message: Buffer<ArrayBufferLike>
  ) => void);
  };
  constructor(host: string) {
    this.mqttClient = null; //init until connection
    this.host = host;
    this.subscribedTopics = {
      [E_TOPICS.VEHICLE_REGISTER]: null,
      [E_TOPICS.VEHICLE_HEALTH]: null,
      [E_TOPICS.TELEMETRY]: null,
      [E_TOPICS.MISSION_STATUS]: null,
    };
  }

  async connect() {
    try {
      const options:IClientOptions = {
        clientId: uuidv4(),
        host: this.host,
        port: parseInt(process.env.MQTT_POSRT) || 1883,
        protocol: 'mqtt' as const,
        protocolId: 'MQTT',
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 1000,
        protocolVersion: 4 as const,
        username: process.env.MQTT_ADMIN_USER,
        password:process.env.MQTT_ADMIN_PASSWORD,
      }
      this.mqttClient = await mqtt
        .connectAsync(options)
        .catch((err) => {
          console.error(`Error connecting to MQTT broker: ${err}`);
          throw err;
        });
      console.log(`MQTT client connected`);
    } catch (error) {
      if (this.mqttClient) this.mqttClient.end();
      console.error(`Error connecting to MQTT broker: ${error}`);
      return false;
    }

    // MQTT Callback for 'error' event
    this.mqttClient.on("error", (err) => {
      console.log(err);
      if (this.mqttClient) this.mqttClient.end();
    });

    // Call the message callback function when message arrived
    this.mqttClient.on("message", (topic, message) => {
      console.log("[MQTT client]: received a message: ", message.toString());
      if (this.subscribedTopics[topic]) {
        this.subscribedTopics[topic](topic, message);
      } else {
        console.log(`No callback registered for topic ${topic}`);
      }
    });

    this.mqttClient.on("close", () => {
      console.log(`MQTT client disconnected`);
    });

    //connection success
    return true;
  }

  // Publish MQTT Message
  async publish(
    topic: string,
    message: string,
    options: ClientPublishOptionsInterface
  ) {
    if (!this.mqttClient) {
      console.error("MQTT client not connected");
      const connected = await this.connect();
      if (!connected) {
        console.error("MQTT client not connected");
        return false;
      }
    }
    const state = await this.mqttClient.publishAsync(topic, message, options);
    return !!state;
  }

  // Subscribe to MQTT Message
  async subscribe(
    topic: string,
    options: ClientSubscribeOptionsInterface,
    OnMessageCallback: (topic: string, message: Buffer<ArrayBufferLike>) => void
  ) {
    if (!this.mqttClient) {
      console.error("MQTT client not connected");
      const connected = await this.connect();
      if (!connected) {
        console.error("MQTT client not connected");
        return false;
      }
    }
    const subscribe_res = await this.mqttClient.subscribeAsync(topic, options);
    if (subscribe_res.find((grant) => grant.qos === 128)) {
      return false;
    }
    this.subscribedTopics[topic] = OnMessageCallback;
    return true;
  }

  async close() {
    await this.mqttClient.endAsync();
  }
}
