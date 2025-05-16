"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E_TOPICS = exports.E_QOS = void 0;
var E_QOS;
(function (E_QOS) {
    E_QOS[E_QOS["AT_MOST_ONCE"] = 0] = "AT_MOST_ONCE";
    E_QOS[E_QOS["AT_LEAST_ONCE"] = 1] = "AT_LEAST_ONCE";
    E_QOS[E_QOS["EXACTLY_ONCE"] = 2] = "EXACTLY_ONCE";
})(E_QOS || (exports.E_QOS = E_QOS = {}));
var E_TOPICS;
(function (E_TOPICS) {
    E_TOPICS["VEHICLE_REGISTER"] = "vehicle/register";
})(E_TOPICS || (exports.E_TOPICS = E_TOPICS = {}));
//# sourceMappingURL=businessTypes.js.map