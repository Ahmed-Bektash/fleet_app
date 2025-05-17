import express from "express";
const app = express();
const port = 3000;
import { VehicleServiceFactory } from "./libs/services/vehicle/VahicleServiceFactory";

// handle env file
import dotenv from "dotenv";
import { MQTTServiceFactory } from "./libs/Infrastructure/mqtt/mqttServiceFactory";
import { IMqttClient } from "./libs/Infrastructure/mqtt/mqttTypes";
import { missionRouter } from "./api/missionRouter";
import { TelemetryServiceFactory } from "./libs/services/telemetry/TelemetryServiceFactory";
import { MissionServiceFactory } from "./libs/services/mission/missionServiceFactory";
dotenv.config();

//TODO: remove after testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use("/missions", missionRouter);

app.listen(port, async () => {
  console.log(`app listening on port ${port}`);
  const messageClient = await connectToMqttBroker();
  await connectAllSubscribers(messageClient);
});

//TODO handle graceful shutdown
//TODO handle error
app.on("error", (err) => {
  // You can also use a custom error handler middleware if needed
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
    ) => {
      res
        .status(500)
        .json({ error: "Internal Server Error", message: err.message });
    }
  );
  // Optionally, you can also log the error to a file or monitoring service
  console.error("Error occurred:", err);
  process.exit(1); // Exit the process if needed
});
//TODO handle logging
//TODO handle config
//TODO handle env
//TODO handle cors
//TODO handle security

async function connectToMqttBroker() {
  const mqttService = MQTTServiceFactory.makeMqttService();
  const connection = await mqttService.connect();
  if (connection) {
    console.log("Connected to MQTT broker");
    return mqttService;
  } else {
    console.error("Failed to connect to MQTT broker");
    throw new Error("Failed to connect to MQTT broker");
  }
}

async function connectAllSubscribers(messageClient: IMqttClient) {
  //connect all subscribers
  const vehicleServiceFactory = new VehicleServiceFactory();
  const telemetryServiceFactory = new TelemetryServiceFactory();
  const missionServiceFactory = new MissionServiceFactory();
  await vehicleServiceFactory.makeRegisterVehicleSubscriber(messageClient);
  await vehicleServiceFactory.makeVehicleHealthSubscriber(messageClient);
  await telemetryServiceFactory.makeAddTelemetrySubscriber(messageClient);
  await missionServiceFactory.makeReceiveMissionStatusSubscriber(messageClient);

}
