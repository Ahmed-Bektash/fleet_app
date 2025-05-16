
export enum E_EnvironmentName_dbconfig {
  DEV = 'development',
  PROD = 'production',
  TESTING = 'test',
  STAGING = 'staging',
  UNDEFINED = 'UNDEFINED',
}
const ENV =
  (process.env['SYSTEM_ENV'] as E_EnvironmentName_dbconfig) ||
  E_EnvironmentName_dbconfig.DEV;

export const getEnv = () => {
  return ENV;
};

export const getDbName = (): string => {
  return process.env['DB_NAME'];
};

export const getDbUser = (): string => {
  return process.env[`DB_USER`];
};

export const getDbPassword = (): string => {
  return process.env['DB_PASSWORD'];
};

export const getDbHost = (): string => {
  return process.env['DB_HOST'];
};

export const getDbPort = (): number => {
  return parseInt(process.env['DB_PORT']);
};


export const getDbConnectionString = (): string | undefined => {
  return process.env['DB_CONNECTION_STRING'];
};
