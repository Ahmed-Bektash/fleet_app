"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
class MqttService {
    constructor(host, mqttAdapter) {
        this.host = host;
        this.mqttAdapter = mqttAdapter;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // Connect to MQTT Broker
            try {
                const connection = yield this.mqttAdapter.connect(this.host);
                return connection;
            }
            catch (error) {
                console.error(`Error connecting to MQTT broker: ${error}`);
                return false;
            }
        });
    }
    // Publish MQTT Message
    publish(topic, message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const publish_res = yield this.mqttAdapter.publish(topic, message, options);
            return publish_res;
        });
    }
    // Subscribe to MQTT Message
    subscribe(topic, options, OnMessageCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.mqttAdapter.subscribe(topic, options, OnMessageCallback);
            return ret;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mqttAdapter.close();
        });
    }
}
exports.MqttService = MqttService;
//# sourceMappingURL=mqttService.js.map