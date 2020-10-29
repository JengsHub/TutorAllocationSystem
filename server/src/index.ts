import "reflect-metadata";
import {createConnection} from "typeorm";

import express, { Express } from "express";
import cors from "cors";

import bodyParser from "body-parser";

createConnection({
    type:"postgres",
    database: "local_dev",
    username: "postgres",
    password: "empty",
    port: 5432,
    host: "localhost",
    entities: [
        __dirname + "/entity/*.js"
    ],
    synchronize: true
}).then(() => {console.log("CONNECTED")}).catch(e => console.error());