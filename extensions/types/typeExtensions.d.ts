/* eslint-disable @typescript-eslint/no-unused-vars */
// #region Util namespaces

declare namespace types {
  import * as express from 'express';
  type RequestHandler = express.RequestHandler;
  export { RequestHandler };
}

// #endregion

// #region Modules

declare module NodeJS {
  interface ProcessEnv {
    ENVIRONMENT: string;
    PORT: string;
    DB_CONNECTION_STRING: string;
    DB_PASSWORD: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_COOKIE_EXPIRES_IN: number;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    EMAIL_HOST: string;
    EMAIL_PORT: number;
  }
}

declare module 'xss-clean' {
  declare function xss(): types.RequestHandler;
  export default xss;
}

// #endregion
