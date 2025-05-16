import { knexSnakeCaseMappers } from 'objection';
import { Knex } from 'knex';
import { getDbHost, getDbName, getDbPassword, getDbPort, getDbUser } from './dbConfig';


const knexConfig: Knex.Config = {
   client: 'pg',
  connection:{
      database: getDbName(),
      user: getDbUser(),
      password: getDbPassword(),
      host: getDbHost(),
      port: getDbPort(),
    },
  pool: {
    min: 0, //0 is recommended in knex docs to disbale stale connections
    max: 10,
  },
  migrations: {
    extension: 'ts',
    tableName: 'knex_migrations',
  },
  seeds: {
    extension: 'ts',
    directory: './seeds', //for example data during development
  },
  acquireConnectionTimeout: 10000,
  ...knexSnakeCaseMappers,
};


export default knexConfig;
