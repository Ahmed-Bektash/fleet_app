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
exports.VehicleServiceFactory = void 0;
const mqttServiceFactory_1 = require("../../Infrastructure/mqtt/mqttServiceFactory");
const businessTypes_1 = require("../../shared/types/businessTypes");
const registerVehicleUseCase_1 = require("./registerVehicleUseCase");
const vehicleDataHandler_1 = require("./vehicleDataHandler");
class VehicleServiceFactory {
    constructor() {
        this.vehicleDataHandler = vehicleDataHandler_1.VehicleDataHandler.getInstance();
        this.registerVehicleRequestAdapter = (topic, message) => {
            const mock_body = {
                topic: topic,
                message: message,
            };
            return mock_body;
            // const mock_body = {
            //   vin: "1HGCM82633A123456",
            //   vehicleType: "Sedan",
            //   vehicleModel: "Honda Accord",
            //   vehicleYear: 2023,
            // };
        };
    }
    /**
     * @requires: to be called during the application startup
     * @description: this method will create a subscriber to the vehicle register topic
     */
    makeRegisterVehicleSubscriber() {
        return __awaiter(this, void 0, void 0, function* () {
            const messageClient = new mqttServiceFactory_1.MQTTServiceFactory().makeMqttService();
            //await connection to mqtt broker by list of relevant topics
            const connection = yield messageClient.connect();
            if (connection) {
                //subscribe to all topics
                const subscribe = yield messageClient.subscribe(businessTypes_1.E_TOPICS.VEHICLE_REGISTER, { qos: businessTypes_1.E_QOS.AT_LEAST_ONCE }, //TODO: should handle idempotency
                this.registerVehicleSubscriberCallback);
                if (!subscribe) {
                    //fail gracefully
                    console.error("Failed to subscribe to topic:", businessTypes_1.E_TOPICS.VEHICLE_REGISTER);
                }
            }
        });
    }
    //initial testing of the controller
    makeRegisterVehicleServiceConroller() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                main: () => __awaiter(this, void 0, void 0, function* () {
                    return {
                        status: 200,
                        headers: {},
                        data: {},
                    };
                })
            };
        });
    }
    registerVehicleSubscriberCallback(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messageClient = new mqttServiceFactory_1.MQTTServiceFactory().makeMqttService();
                const usecase = yield new registerVehicleUseCase_1.RegisterVehicleUseCase(this.vehicleDataHandler, messageClient).execute(this.registerVehicleRequestAdapter(topic, message));
                if (!usecase.state) {
                    // handle error here
                }
            }
            catch (error) {
                console.error("Error in registerVehicle:", error);
            }
        });
    }
}
exports.VehicleServiceFactory = VehicleServiceFactory;
//# sourceMappingURL=VahicleServiceFactory.js.map