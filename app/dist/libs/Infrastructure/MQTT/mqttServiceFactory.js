"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTServiceFactory = void 0;
const mqttAdapter_1 = require("./mqttAdapter");
const mqttService_1 = require("./mqttService");
class MQTTServiceFactory {
    makeMqttService() {
        //TODO: should be singleton?
        //TODO: use env variable for host
        const host = process.env.MQTT_HOST || "mqtt://localhost:1883";
        const mqttAdabter = new mqttAdapter_1.MqttAdapter(host);
        const mqttService = new mqttService_1.MqttService(host, mqttAdabter);
        return mqttService;
    }
}
exports.MQTTServiceFactory = MQTTServiceFactory;
//# sourceMappingURL=mqttServiceFactory.js.map