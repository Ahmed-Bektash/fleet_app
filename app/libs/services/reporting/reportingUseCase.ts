import {
  BaseUseCase,
  E_HttpResponseStatus,
  Result,
} from "../../shared/types/generalTypes";
import {
  IGetMissionsReport,
  IReportingDataHandler,
  MissionsReport,
} from "./reportingTypes";

export class GenerateMissionsReportUseCase
  implements BaseUseCase<IGetMissionsReport>
{
  private readonly reportsDataHandler: IReportingDataHandler;

  constructor(reportsDataHandler: IReportingDataHandler) {
    this.reportsDataHandler = reportsDataHandler;
  }
  async execute(
    request: IGetMissionsReport
  ): Promise<Result<MissionsReport[]>> {
    try {
      const { start_time_ms, end_time_ms, limit, offset } = request;
      const result = await this.fetchMissionsReport({
        start_time_ms,
        end_time_ms,
        limit,
        offset,
      });
      if (result.state) {
        return {
          state: true,
          data: result.data,
          error: null,
        };
      }
      throw result.error;
    } catch (error) {
      return {
        state: false,
        data: null,
        error: {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "Internal server error",
          details: error.message,
        },
      };
    }
  }

  /**
   *
   * @description: Fetches the missions report from the database.
   *                  in the future, this can be replaced with a call to the needed services and aggregated here.
   * @param {IGetMissionsReport} request - The request object containing the parameters for the report.
   */
  private async fetchMissionsReport({
    start_time_ms,
    end_time_ms,
    limit,
    offset,
  }: IGetMissionsReport): Promise<Result<MissionsReport[]>> {
    const result = await this.reportsDataHandler.getMissionsReport(
      start_time_ms,
      end_time_ms,
      limit,
      offset
    );
    if (result.state) {
      return {
        state: true,
        data: result.data,
        error: null,
      };
    } else {
      return {
        state: false,
        data: null,
        error: {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "Internal server error",
          details: result.error?.details,
        },
      };
    }
  }
}
