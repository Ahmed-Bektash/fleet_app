import mqtt, { IClientOptions, MqttClient } from "mqtt";
import {
  ClientPublishOptionsInterface,
  ClientSubscribeOptionsInterface,
  IMqttClient,
} from "./mqttTypes";
import { v4 as uuidv4 } from 'uuid';
export class MqttAdapter implements IMqttClient {
  private mqttClient: MqttClient;
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;
  private messageCallback: (
    topic: string,
    message: Buffer<ArrayBufferLike>
  ) => void;
  constructor(host: string, username: string, password: string) {
    //TODO: handle client auth and client id
    this.mqttClient = null; //init until connection
    this.host = host;
    this.username = username;
    this.password = password;
  }

  async connect() {
    try {
      const options:IClientOptions = {
        clientId: uuidv4(),
        host: this.host,
        port: 1883,
        protocol: 'mqtt' as const,
        protocolId: 'MQTT',
        clean: true,
        connectTimeout: 4000,
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
    this.mqttClient.on("message", function (topic, message) {
      console.log("[MQTT client]: received a message: ", message.toString());
      if (this.messageCallback) {
        this.messageCallback(topic, message);
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
    const state = await this.mqttClient.publishAsync(topic, message, options);
    return !!state;
  }

  // Subscribe to MQTT Message
  async subscribe(
    topic: string,
    options: ClientSubscribeOptionsInterface,
    OnMessageCallback: (topic: string, message: Buffer<ArrayBufferLike>) => void
  ) {
    this.messageCallback = OnMessageCallback;
    const subscribe_res = await this.mqttClient.subscribeAsync(topic, options);
    if (subscribe_res.find((grant) => grant.qos === 128)) {
      return false;
    }
    return true;
  }

  async close() {
    await this.mqttClient.endAsync();
  }
}
