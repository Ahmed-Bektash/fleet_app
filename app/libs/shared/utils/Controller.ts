import { BaseUseCase, E_HttpResponseStatus, HttpRequest, HttpResponse, Result, standardApiResponseBody } from "../types/generalTypes";

export interface BaseController {
  main: (request: HttpRequest) => Promise<HttpResponse> | HttpResponse;
  createHttpResponse: (result: Result) => HttpResponse;
  getHttpStatusFromErrorCodes: (result: Result) => E_HttpResponseStatus;
}


export class Controller<T> implements BaseController {
  private readonly useCase: BaseUseCase<T>;
  requestConverter: (HttpRequest: HttpRequest) => T;

  constructor(
    useCase: BaseUseCase<T>,
    requestConverter:(HttpRequest: HttpRequest) => T,
  ) {
    this.useCase = useCase;
    this.requestConverter = requestConverter;
  }

  public main = async (request: HttpRequest): Promise<HttpResponse> => {
    const internalReq: T = this.requestConverter(request);
    const executionRes = await this.useCase.execute(internalReq);
    const response = this.createHttpResponse(executionRes);
    return response;
  };

  createHttpResponse = (result: Result): HttpResponse => {
    //response body
    const state = result.state;
    const data = result.data;
    const error = result.error;

    const body: standardApiResponseBody<typeof result.data> = {
      success: state,
      data: data,
      error: error,
    };
    const resBody = JSON.stringify(body);
    //get the response status:
    const response: HttpResponse = {
      status: this.getHttpStatusFromErrorCodes(result),
      headers: {
        'Content-Type': 'application/json',
      },
      data: resBody,
    };

    return response;
  };

  getHttpStatusFromErrorCodes(result: Result): E_HttpResponseStatus {
    if (result.state) {
      return E_HttpResponseStatus.OK;
    }
    return result.error
      ? Number(result.error.code)
      : E_HttpResponseStatus.SERVER_ERROR;
  }
}
