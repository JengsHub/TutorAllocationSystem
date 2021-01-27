import dotenv from "dotenv";
import path from "path";
const env = process.env;
switch (env.NODE_ENV) {
  case "development":
  case "dev":
    dotenv.config({ path: path.resolve(__dirname, "../.dev.env") });
    break;
  case "production":
  case "prod":
    dotenv.config({ path: path.resolve(__dirname, "../.prod.env") });
    break;
  default:
    dotenv.config({ path: path.resolve(__dirname, "../.dev.env") });
}

export type Config = {
  PORT: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_SYNC: boolean;
  DB_LOGS: boolean;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  SIB_EMAIL_KEY: string;
  SMTP_SERVICE: string;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  FROM_EMAIL: string;
  CLIENT_URL: string;
  CLIENT_DOMAIN: string;
};
export const config: Config = {
  PORT: env.PORT || "localhost",
  DB_HOST: env.DB_HOST || "localhost",
  DB_PORT: env.DB_PORT ? parseInt(env.DB_PORT) : 5432,
  DB_NAME: env.DB_NAME || "postgres",
  DB_USERNAME: env.DB_USERNAME || "postgres",
  DB_PASSWORD: env.DB_PASSWORD || "password",
  DB_SYNC: env.DB_SYNC === "true" ? true : false,
  DB_LOGS: env.DB_LOGS === "true" ? true : false,
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET || "",
  SIB_EMAIL_KEY: env.SIB_EMAIL_KEY || "",
  SMTP_SERVICE: env.SMTP_SERVICE || "",
  SMTP_USER: env.SMTP_USER || "",
  SMTP_PASSWORD: env.SMTP_PASSWORD || "",
  FROM_EMAIL: env.FROM_EMAIL || "",
  CLIENT_URL: env.CLIENT_URL || "localhost:3000",
  CLIENT_DOMAIN: env.CLIENT_DOMAIN || "localhost",
};
console.log(process.env.NODE_ENV);
console.log(config);
