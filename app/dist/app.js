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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const subscriber_1 = require("./api/subscriber");
const publisher_1 = require("./api/publisher");
const vehicleRouter_1 = require("./api/vehicleRouter");
const VahicleServiceFactory_1 = require("./libs/services/vehicle/VahicleServiceFactory");
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/subscriber", subscriber_1.router);
app.use("/publisher", publisher_1.router);
app.use("/vehicle", vehicleRouter_1.vehicleRouter);
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Example app listening on port ${port}`);
    //TODO: add health check
    //connect all subscribers
    const vehicleServiceFactory = new VahicleServiceFactory_1.VehicleServiceFactory();
    yield vehicleServiceFactory.makeRegisterVehicleSubscriber();
}));
//TODO handle graceful shutdown
//TODO handle error
app.on("error", (err) => {
    // You can also use a custom error handler middleware if needed
    app.use((err, req, res, next) => {
        res
            .status(500)
            .json({ error: "Internal Server Error", message: err.message });
    });
    // Optionally, you can also log the error to a file or monitoring service
    console.error("Error occurred:", err);
    process.exit(1); // Exit the process if needed
});
//TODO handle logging
//TODO handle config
//TODO handle env
//TODO handle cors
//TODO handle security
//# sourceMappingURL=app.js.map