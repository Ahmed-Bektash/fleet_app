import { MqttAdapter } from "./mqttAdapter";
import { MqttService } from "./mqttService";

export class MQTTServiceFactory {
    public makeMqttService(){
        const host = process.env.MQTT_HOST || "mqtt://0.0.0.0:1883";
        const mqttAdabter = new MqttAdapter(host);
        const mqttService = new MqttService(mqttAdabter);
        
        return mqttService;
    }
} 