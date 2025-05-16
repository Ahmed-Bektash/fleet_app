"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const generalTypes_1 = require("../types/generalTypes");
class Controller {
    constructor(useCase, requestConverter) {
        this.main = (request) => __awaiter(this, void 0, void 0, function* () {
            const internalReq = this.requestConverter(request);
            const executionRes = yield this.useCase.execute(internalReq);
            const response = this.createHttpResponse(executionRes);
            return response;
        });
        this.createHttpResponse = (result) => {
            //response body
            const state = result.state;
            const data = result.data;
            const error = result.error;
            const body = {
                success: state,
                data: data,
                error: error,
            };
            const resBody = JSON.stringify(body);
            //get the response status:
            const response = {
                status: this.getHttpStatusFromErrorCodes(result),
                headers: {
                    'Content-Type': 'application/json',
                },
                data: resBody,
            };
            return response;
        };
        this.useCase = useCase;
        this.requestConverter = requestConverter;
    }
    getHttpStatusFromErrorCodes(result) {
        if (result.state) {
            return generalTypes_1.E_HttpResponseStatus.OK;
        }
        return result.error
            ? Number(result.error.code)
            : generalTypes_1.E_HttpResponseStatus.SERVER_ERROR;
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map