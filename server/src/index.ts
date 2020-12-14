// Configure .env file
import dotenv from "dotenv";
const result = dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "typescript-rest";
// Importing all services
import "./services";
import { TryDBConnect } from "./helpers";
import authRoutes from "./services/AuthService";

import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { authCheck } from "./helpers/auth";
const FileStore = require('session-file-store')(session);

export const app: express.Application = express();

if (result.error) {
  throw result.error;
}

const fileStoreOptions = {};
app.use(
  session({
    store: new FileStore({}),
    name: "sid",
    secret: ["ioq2sdjkabf891234!@#^SDAIOFq239as"],
    cookie: {
      httpOnly: true, //TODO: should enable this?
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
    rolling: true, // automatically set new expiration when user makes request
    resave: true,
    saveUninitialized: false, // do no set cookie if user is not authenticated
  })
);

// parse cookies
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req: Request, res: Response, next) => {
  await TryDBConnect(() => {
    res.json({
      error: "Database connection error, please try again later",
    });
  }, next);
});

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use("/auth", authRoutes);

// Middleware to require authentication for all routes in /units
app.use("/units", authCheck); 

Server.buildServices(app);

// Just checking if given PORT variable is an integer or not
let port = parseInt(process.env.PORT || "");
if (isNaN(port) || port === 0) {
  port = 8888;
}

app.listen(port, () => {
  console.log(`Server Started at PORT: ${port}`);
});
