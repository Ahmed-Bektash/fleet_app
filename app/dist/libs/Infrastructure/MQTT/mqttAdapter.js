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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttAdapter = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
class MqttAdapter {
    constructor(host) {
        //TODO: handle client auth and client id
        this.mqttClient = null; //init until connection
        this.host = host;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.mqttClient = yield mqtt_1.default.connectAsync(this.host).catch((err) => {
                    console.error(`Error connecting to MQTT broker: ${err}`);
                    throw err;
                });
                console.log(`MQTT client connected`);
            }
            catch (error) {
                this.mqttClient.end();
                console.error(`Error connecting to MQTT broker: ${error}`);
                return false;
            }
            // MQTT Callback for 'error' event
            this.mqttClient.on("error", (err) => {
                console.log(err);
                if (this.mqttClient)
                    this.mqttClient.end();
            });
            // Call the message callback function when message arrived
            this.mqttClient.on("message", function (topic, message) {
                console.log("[MQTT client]: received a message: ", message.toString());
                if (this.messageCallback) {
                    this.messageCallback(topic, message);
                }
                else {
                    console.log(`No callback registered for topic ${topic}`);
                }
            });
            this.mqttClient.on("close", () => {
                console.log(`MQTT client disconnected`);
            });
            //connection success
            return true;
        });
    }
    // Publish MQTT Message
    publish(topic, message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.mqttClient.publishAsync(topic, message, options);
            return !!state;
        });
    }
    // Subscribe to MQTT Message
    subscribe(topic, options, OnMessageCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.messageCallback = OnMessageCallback;
            const subscribe_res = yield this.mqttClient.subscribeAsync(topic, options);
            if (subscribe_res.find((grant) => grant.qos === 128)) {
                ;
                return false;
            }
            return true;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mqttClient.endAsync();
        });
    }
}
exports.MqttAdapter = MqttAdapter;
//# sourceMappingURL=mqttAdapter.js.map