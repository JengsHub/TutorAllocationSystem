import path from "path";
import { ConnectionOptions } from "typeorm";
// Configure .env file
import dotenv from "dotenv";
import { config } from "./config";
// const result = dotenv.config();

const isCompiled = path.extname(__filename).includes("js");

export = {
  type: "postgres",
  host: config.DB_HOST || "localhost",
  port: config.DB_PORT || 5432,
  username: config.DB_USERNAME || "postgres",
  password: config.DB_PASSWORD || "password",
  database: config.DB_NAME || "postgres",
  synchronize: config.DB_SYNC || false,
  logging: config.DB_LOGS || false,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  migrationsRun: false,
  entities: [__dirname + "/entity/**/*{.ts,.js}"],
  migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
  seeds: ["src/database/seeds/**/*{.ts,.js}"],
  factories: ["src/database/factories/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migrations",
  },
} as ConnectionOptions;
