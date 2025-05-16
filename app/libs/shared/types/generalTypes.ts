export interface HttpResponse<T = string> {
  data: T;
  status: E_HttpResponseStatus;
  headers: Dictionary;
}

export type Dictionary = {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | Dictionary;
}

export interface HttpRequest<T = unknown> {
  url: string;
  method: E_httpMethod;
  headers?: Dictionary;
  searchParams?: Dictionary;
  params?: string;
  body?: T  | Dictionary;
  authId?: string;
}

export interface Result<T = unknown> {
    state: boolean;
    data?: T;
    error?: {
        code: E_HttpResponseStatus;
        message: string;
        details?: string;
        [key: string]: unknown;
    };
}

export interface BaseUseCase<T> {
  execute: (dataObject: T) => Promise<Result> | Result;
  handleErrorFromResult?: (result: Result, code: E_HttpResponseStatus) => void;
}


export type standardApiResponseBody<T> = {
  success: boolean;
  data: T;
  error: {
    code: E_HttpResponseStatus;
    message: string;
    details?: string;
    [key: string]: unknown;
  } | null;
};

export enum E_HttpResponseStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INVALID_LOGIN = 435,
  INVALID_AUTH_CODE = 436,
  BUSINESS_RULE_VIOLATION = 437,
  SESSION_TIMEOUT = 438,
  SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
}

export enum E_httpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
}