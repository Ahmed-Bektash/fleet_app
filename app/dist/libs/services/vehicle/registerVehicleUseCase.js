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
exports.RegisterVehicleUseCase = void 0;
const generalTypes_1 = require("../../shared/types/generalTypes");
class RegisterVehicleUseCase {
    constructor(vehicleDataHandler, messageClient) {
        this.TOPIC = "vehicle/+/register";
        this.vehicleDataHandler = vehicleDataHandler;
        this.messageClient = messageClient;
    }
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = {
                    state: false,
                    data: null,
                    error: null,
                };
                //await connection to mqtt broker by list of relevant topics
                //   const connection = await this.messageClient.connect(this.TOPIC);
                //prse the message
                const message = request.message.toString();
                const topic = request.topic.toString();
                const vin = message.split("/")[1];
                const vehicleType = message.split("/")[2];
                const vehicleModel = message.split("/")[3];
                const vehicleYear = message.split("/")[4];
                const vehicleToken = message.split("/")[5];
                //call the vehicle data handler
                const registerVehicleResult = yield this.vehicleDataHandler.registerVehicle(vin, vehicleType, vehicleModel, vehicleYear, vehicleToken);
                //check if the registration was successful
                if (registerVehicleResult.state) {
                    //publish the message to the mqtt broker
                    const publishResult = yield this.messageClient.publish(topic, JSON.stringify(registerVehicleResult.data), { qos: 1 });
                    if (publishResult) {
                        result.state = true;
                        result.data = registerVehicleResult.data;
                        result.error = null;
                    }
                    else {
                        result.state = false;
                        result.data = null;
                        result.error = {
                            code: generalTypes_1.E_HttpResponseStatus.SERVER_ERROR,
                            message: "Failed to publish message to MQTT broker",
                            details: "Failed to publish message to MQTT broker",
                        };
                    }
                }
                else {
                    result.state = false;
                    result.data = null;
                    result.error = {
                        code: generalTypes_1.E_HttpResponseStatus.SERVER_ERROR,
                        message: "Failed to register vehicle",
                        details: (_a = registerVehicleResult.error) === null || _a === void 0 ? void 0 : _a.message,
                    };
                }
                return result;
            }
            catch (error) {
                return {
                    state: false,
                    error: {
                        code: generalTypes_1.E_HttpResponseStatus.SERVER_ERROR,
                        message: "Internal server error",
                        details: error.message,
                    },
                };
            }
        });
    }
}
exports.RegisterVehicleUseCase = RegisterVehicleUseCase;
//# sourceMappingURL=registerVehicleUseCase.js.map