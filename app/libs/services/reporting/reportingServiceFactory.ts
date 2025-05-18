import { HttpRequest } from "../../shared/types/generalTypes";
import { Controller } from "../../shared/utils/Controller";
import { ReportingDataHandler } from "./reportingDataHandler";
import { IGetMissionsReport } from "./reportingTypes";
import { GenerateMissionsReportUseCase } from "./reportingUseCase";

export class ReportingServiceFactory {
  private readonly reportingDataHandler = ReportingDataHandler.getInstance();

  public async makeAllMissionsReportController() {
    const usecase = new GenerateMissionsReportUseCase(
      this.reportingDataHandler
    );
    const controller = new Controller(
      usecase,
      this.allMissionsReportRequestAdapter
    );
    return controller;
  }

  private readonly allMissionsReportRequestAdapter = (
    httpRequest: HttpRequest
  ): IGetMissionsReport => {
    const { searchParams } = httpRequest;
    const start_time_ms = searchParams["start_time_ms"] ?? null;
    const end_time_ms = searchParams["end_time_ms"] ?? null;
    const limit = searchParams["limit"] ?? null;
    const offset = searchParams["offset"] ?? null;

    return {
      start_time_ms: start_time_ms ? parseInt(start_time_ms as string) : null,
      end_time_ms: start_time_ms ? parseInt(end_time_ms as string): null,
      limit: limit ? parseInt(limit as string) : null,
      offset: offset ? parseInt(offset as string): null,
    };
  };
}
