import express from "express";
const app = express();
const port = 3000;

import { router as subscriberRouter } from "./api/subscriber";
import { router as publisherRouter } from "./api/publisher";
import { vehicleRouter } from "./api/vehicleRouter";
import { VehicleServiceFactory } from "./libs/services/vehicle/VahicleServiceFactory";

// handle env file
import dotenv from "dotenv";
import { MQTTServiceFactory } from "./libs/Infrastructure/mqtt/mqttServiceFactory";
dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/subscriber", subscriberRouter);
app.use("/publisher", publisherRouter);
app.use("/vehicle", vehicleRouter);

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  //TODO: add health check
  //connect all subscribers
     const messageClient = MQTTServiceFactory.makeMqttService();

    //await connection to mqtt broker by list of relevant topics
    const connection = await messageClient.connect();
    if(connection){
      console.log("Connected to MQTT broker");
      //connect all subscribers
      const vehicleServiceFactory = new VehicleServiceFactory();
      await vehicleServiceFactory.makeRegisterVehicleSubscriber(messageClient);
    }else{
      console.error("Failed to connect to MQTT broker");
      throw new Error("Failed to connect to MQTT broker"); //TODO: handle errors
    }
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
      next: express.NextFunction
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
