"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectionWrapper = void 0;
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = __importDefault(require("./knexfile"));
const objection_1 = require("objection");
class ObjectionWrapper {
    constructor() {
        this.connect = () => {
            // Initialize knex.
            if (ObjectionWrapper.knexInstance == null) {
                ObjectionWrapper.knexInstance = (0, knex_1.default)(knexfile_1.default);
                objection_1.Model.knex(ObjectionWrapper.knexInstance);
            }
            return ObjectionWrapper.knexInstance;
        };
        this.close = () => {
            let result = false;
            ObjectionWrapper.knexInstance
                .destroy()
                .then(() => {
                result = true;
            })
                .catch((error) => {
                result = false;
                console.error("Error closing the database connection:", error);
            });
            return Promise.resolve(result);
        };
        this.connect();
    }
}
exports.ObjectionWrapper = ObjectionWrapper;
//# sourceMappingURL=objectionWrapper.js.map