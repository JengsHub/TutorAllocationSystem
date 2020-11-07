import path from "path";
import { ConnectionOptions } from "typeorm";

const isCompiled = path.extname(__filename).includes("js");

export = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "postgres",
  synchronize: process.env.DB_SYNC || false,
  logging: process.env.DB_LOGS || false,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  migrationsRun: true,
  entities: [__dirname + `/src/entity/*.${isCompiled ? "js" : "ts"}`],
  migrations: [__dirname + `/src/migrations/*.${isCompiled ? "js" : "ts"}`],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migrations",
  },
} as ConnectionOptions;
