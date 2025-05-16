"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbConnectionString = exports.getDbPort = exports.getDbHost = exports.getDbPassword = exports.getDbUser = exports.getDbName = exports.getEnv = exports.E_EnvironmentName_dbconfig = void 0;
var E_EnvironmentName_dbconfig;
(function (E_EnvironmentName_dbconfig) {
    E_EnvironmentName_dbconfig["DEV"] = "development";
    E_EnvironmentName_dbconfig["PROD"] = "production";
    E_EnvironmentName_dbconfig["TESTING"] = "test";
    E_EnvironmentName_dbconfig["STAGING"] = "staging";
    E_EnvironmentName_dbconfig["UNDEFINED"] = "UNDEFINED";
})(E_EnvironmentName_dbconfig || (exports.E_EnvironmentName_dbconfig = E_EnvironmentName_dbconfig = {}));
const ENV = process.env['SYSTEM_ENV'] ||
    E_EnvironmentName_dbconfig.DEV;
const getEnv = () => {
    return ENV;
};
exports.getEnv = getEnv;
const getDbName = () => {
    return process.env['DB_NAME'];
};
exports.getDbName = getDbName;
const getDbUser = () => {
    return process.env[`DB_USER`];
};
exports.getDbUser = getDbUser;
const getDbPassword = () => {
    return process.env['DB_PASSWORD'];
};
exports.getDbPassword = getDbPassword;
const getDbHost = () => {
    return process.env['DB_HOST'];
};
exports.getDbHost = getDbHost;
const getDbPort = () => {
    return parseInt(process.env['DB_PORT']);
};
exports.getDbPort = getDbPort;
const getDbConnectionString = () => {
    return process.env['DB_CONNECTION_STRING'];
};
exports.getDbConnectionString = getDbConnectionString;
//# sourceMappingURL=sqliteConfig.js.map