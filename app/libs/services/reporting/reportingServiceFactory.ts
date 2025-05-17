import { HttpRequest } from "../../shared/types/generalTypes";
import { Controller } from "../../shared/utils/Controller";
import { ReportingDataHandler } from "./reportingDataHandler";
import { IGetMissionsReport } from "./reportingTypes";
import { GenerateMissionsReportUseCase } from "./reportingUseCase";

export class ReportingServiceFactory {
  private readonly reportingDataHandler = ReportingDataHandler.getInstance();

  public async makeAllMissionsReportController() {
    const usecase = new GenerateMissionsReportUseCase(this.reportingDataHandler);
    const controller = new Controller(usecase,this.allMissionsReportRequestAdapter);
    return controller;
  }

  private readonly allMissionsReportRequestAdapter = (
    httpRequest: HttpRequest
  ): IGetMissionsReport => {
    const { searchParams } = httpRequest;
    const start_time_ms = searchParams["start_time_ms"];
    const end_time_ms = searchParams["end_time_ms"];
    const limit = searchParams["limit"];
    const offset = searchParams["offset"];

    return {
      start_time_ms: parseInt(start_time_ms as string),
      end_time_ms: parseInt(end_time_ms as string),
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    };
  };
}
