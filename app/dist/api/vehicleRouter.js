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
exports.vehicleRouter = void 0;
const express_1 = __importDefault(require("express"));
const VahicleServiceFactory_1 = require("../libs/services/vehicle/VahicleServiceFactory");
exports.vehicleRouter = express_1.default.Router();
exports.vehicleRouter.get("/register", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const internalReq = {
            body: req.body,
            params: req.params,
            searchParams: req.query,
            headers: req.headers,
            method: req.method,
            url: req.url,
        };
        const controller = yield new VahicleServiceFactory_1.VehicleServiceFactory().makeRegisterVehicleServiceConroller();
        const response = controller.main();
        response
            .then((internal_resp) => {
            res.status(internal_resp.status);
            res.header(internal_resp.headers);
            res.send(internal_resp.data);
        })
            .catch((err) => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
    });
});
//# sourceMappingURL=vehicleRouter.js.map