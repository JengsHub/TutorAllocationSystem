"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
typeorm_1.createConnection({
    type: "postgres",
    database: "local_dev",
    username: "postgres",
    password: "empty",
    port: 5432,
    host: "localhost",
    entities: [
        __dirname + "/entity/*.js"
    ],
    synchronize: true
}).then(() => { console.log("CONNECTED"); }).catch(e => console.error());
