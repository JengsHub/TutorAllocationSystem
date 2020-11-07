import { ConnectionOptions } from "typeorm";
import path from "path";
import { Activity } from "./entity/Activity";
import { Allocation } from "./entity/Allocation";
import { Availability } from "./entity/Availability";
import { Staff } from "./entity/Staff";
import { StaffPreference } from "./entity/StaffPreference";
import { Unit } from "./entity/Unit";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const isCompiled = path.extname(__filename).includes("js");

export default {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "postgres",
  synchronize: !process.env.DB_NO_SYNC || true,
  logging: !process.env.DB_NO_LOGS,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  entities: [__dirname + `/entity/*.${isCompiled ? "js" : "ts"}`],
  migrations: [__dirname + `/migrations/*.${isCompiled ? "js" : "ts"}`],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migrations",
  },
} as ConnectionOptions;
