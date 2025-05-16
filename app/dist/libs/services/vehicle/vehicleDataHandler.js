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
exports.VehicleDataHandler = void 0;
const objectionWrapper_1 = require("../../Infrastructure/db/objectionWrapper");
const generalTypes_1 = require("../../shared/types/generalTypes");
class VehicleDataHandler extends objectionWrapper_1.ObjectionWrapper {
    constructor() {
        super();
    }
    static getInstance() {
        var _a;
        (_a = VehicleDataHandler.instance) !== null && _a !== void 0 ? _a : (VehicleDataHandler.instance = new VehicleDataHandler());
        return VehicleDataHandler.instance;
    }
    registerVehicle(vin, vehicleType, vehicleModel, vehicleYear, vehicleToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Simulate a successful registration
                return {
                    state: true,
                    data: { vin, vehicleType, vehicleModel, vehicleYear, vehicleToken },
                    error: null,
                };
            }
            catch (error) {
                return {
                    state: false,
                    data: null,
                    error: {
                        code: generalTypes_1.E_HttpResponseStatus.SERVER_ERROR,
                        message: "Internal server error",
                        details: error.message,
                    },
                };
            }
        });
    }
    authVehicle(vehicleToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Simulate a successful authentication
                return {
                    state: true,
                    data: { vehicleToken },
                    error: null,
                };
            }
            catch (error) {
                return {
                    state: false,
                    data: null,
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
exports.VehicleDataHandler = VehicleDataHandler;
//# sourceMappingURL=vehicleDataHandler.js.map