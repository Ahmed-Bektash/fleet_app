"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E_httpMethod = exports.E_HttpResponseStatus = void 0;
var E_HttpResponseStatus;
(function (E_HttpResponseStatus) {
    E_HttpResponseStatus[E_HttpResponseStatus["OK"] = 200] = "OK";
    E_HttpResponseStatus[E_HttpResponseStatus["CREATED"] = 201] = "CREATED";
    E_HttpResponseStatus[E_HttpResponseStatus["ACCEPTED"] = 202] = "ACCEPTED";
    E_HttpResponseStatus[E_HttpResponseStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    E_HttpResponseStatus[E_HttpResponseStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    E_HttpResponseStatus[E_HttpResponseStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    E_HttpResponseStatus[E_HttpResponseStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    E_HttpResponseStatus[E_HttpResponseStatus["CONFLICT"] = 409] = "CONFLICT";
    E_HttpResponseStatus[E_HttpResponseStatus["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    E_HttpResponseStatus[E_HttpResponseStatus["INVALID_LOGIN"] = 435] = "INVALID_LOGIN";
    E_HttpResponseStatus[E_HttpResponseStatus["INVALID_AUTH_CODE"] = 436] = "INVALID_AUTH_CODE";
    E_HttpResponseStatus[E_HttpResponseStatus["BUSINESS_RULE_VIOLATION"] = 437] = "BUSINESS_RULE_VIOLATION";
    E_HttpResponseStatus[E_HttpResponseStatus["SESSION_TIMEOUT"] = 438] = "SESSION_TIMEOUT";
    E_HttpResponseStatus[E_HttpResponseStatus["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    E_HttpResponseStatus[E_HttpResponseStatus["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
})(E_HttpResponseStatus || (exports.E_HttpResponseStatus = E_HttpResponseStatus = {}));
var E_httpMethod;
(function (E_httpMethod) {
    E_httpMethod["GET"] = "GET";
    E_httpMethod["POST"] = "POST";
    E_httpMethod["PUT"] = "PUT";
    E_httpMethod["DELETE"] = "DELETE";
    E_httpMethod["OPTIONS"] = "OPTIONS";
    E_httpMethod["PATCH"] = "PATCH";
})(E_httpMethod || (exports.E_httpMethod = E_httpMethod = {}));
//# sourceMappingURL=generalTypes.js.map