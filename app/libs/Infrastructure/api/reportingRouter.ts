import express from "express";
import { Dictionary, E_httpMethod, HttpRequest } from "../../shared/types/generalTypes";
import { ReportingServiceFactory } from "../../services/reporting/reportingServiceFactory";
export const reportsRouter = express.Router();

reportsRouter.get("/", async function (req, res) {
  const internalReq: HttpRequest = {
    body: req.body,
    params: req.params as string,
    searchParams: req.query as Dictionary,
    headers: req.headers,
    method: req.method as E_httpMethod,
    url: req.url,
  };
  const controller = await
    new ReportingServiceFactory().makeAllMissionsReportController();
  const response = controller.main(internalReq);
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