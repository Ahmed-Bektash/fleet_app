import express from "express";
import { VehicleServiceFactory } from "../libs/services/vehicle/VahicleServiceFactory";
import {
  Dictionary,
  E_httpMethod,
  HttpRequest,
} from "../libs/shared/types/generalTypes";
export const vehicleRouter = express.Router();

vehicleRouter.post("/mission", async function (req, res) {
  const internalReq: HttpRequest = {
    body: req.body,
    params: req.params as string,
    searchParams: req.query as Dictionary,
    headers: req.headers,
    method: req.method as E_httpMethod,
    url: req.url,
  };
  // const controller = await
  //   new VehicleServiceFactory().makeRegisterVehicleServiceConroller();
  // const response = controller.main();
  // response
  //   .then((internal_resp) => {
  //     res.status(internal_resp.status);
  //     res.header(internal_resp.headers);
  //     res.send(internal_resp.data);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500).send("Internal Server Error");
  //   });
});
