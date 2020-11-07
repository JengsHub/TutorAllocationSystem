import { ConnectionOptions } from "typeorm";
import path from "path";
import { Activity } from "./entity/Activity";
import { Allocation } from "./entity/Allocation";
import { Availability } from "./entity/Availability";
import { Staff } from "./entity/Staff";
import { StaffPreference } from "./entity/StaffPreference";
import { Unit } from "./entity/Unit";
import { SnakeNamingStrategy }from "typeorm-naming-strategies";
<<<<<<< Updated upstream


const isCompiled = path.extname(__filename).includes("js");
=======


const isCompiled = path.extname(__filename).includes('js');
console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)

>>>>>>> Stashed changes

export default {
  type: process.env.DB_HOST ? "postgres" : "sqlite",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || "postgres",
<<<<<<< Updated upstream
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "postgres",
  synchronize: !process.env.DB_NO_SYNC || true,
=======
  password: process.env.DB_PASSWORD || "empty",
  database: process.env.DB_NAME || "local_dev.sqlite3",
  synchronize: true,
>>>>>>> Stashed changes
  logging: !process.env.DB_NO_LOGS,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
<<<<<<< Updated upstream
  entities: [__dirname + `/entity/*.${isCompiled ? "js" : "ts"}`],
  migrations: [__dirname + `/migrations/*.${isCompiled ? "js" : "ts"}`],
=======
  // entities: [
  //   __dirname + `/entity/*.ts`
  // ],
  entities: [
    Activity,
    Allocation,
    Availability,
    Staff,
    StaffPreference,
    Unit
  ],
  migrations: [
      __dirname + `/migrations/*.ts`
  ],
>>>>>>> Stashed changes
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migrations",
  },
<<<<<<< Updated upstream
} as ConnectionOptions;
=======
  // namingStrategy: new SnakeNamingStrategy()
} as ConnectionOptions;
>>>>>>> Stashed changes
