import { MqttAdapter } from "./mqttAdapter";
import { MqttService } from "./mqttService";
import { IMqttClient } from "./mqttTypes";

export class MQTTServiceFactory {
    private static mqttService: IMqttClient = null;
    public static makeMqttService(){
        //TODO: should be singleton?
        //TODO: use env variable for host
        const host = process.env.MQTT_HOST || "mqtt://0.0.0.0:1883";
        const username = process.env.MQTT_ADMIN_USER;
        const password = process.env.MQTT_ADMIN_PASSWORD;
        if(this.mqttService){
            return this.mqttService;
        }else{
            const mqttAdabter = new MqttAdapter(host,username, password);
            const mqttService = new MqttService(host,mqttAdabter);
            this.mqttService = mqttService;
        }
        return this.mqttService;
    }
} 