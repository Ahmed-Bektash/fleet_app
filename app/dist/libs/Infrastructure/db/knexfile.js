"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const knexConfig = Object.assign({ client: 'sqlite3', connection: {
        filename: './sqlite.db',
    }, pool: {
        min: 0, //0 is recommended in knex docs to disbale stale connections
        max: 10,
    }, migrations: {
        extension: 'ts',
        tableName: 'knex_migrations',
    }, seeds: {
        extension: 'ts',
        directory: './seeds', //for example data during development
    }, acquireConnectionTimeout: 10000 }, objection_1.knexSnakeCaseMappers);
exports.default = knexConfig;
//# sourceMappingURL=knexfile.js.map