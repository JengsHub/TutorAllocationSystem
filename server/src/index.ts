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
import cookieSession from "cookie-session";
// import { passport } from "./helpers/auth";
import passport from "passport";
const passportSetup = require("./helpers/auth");

export const app: express.Application = express();

if (result.error) {
  throw result.error;
}
// set up session cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["ioqwer902sdjkabf891234!@#^SDAIOFq239as"], // TODO: .env
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(async (req: Request, res: Response, next) => {
  await TryDBConnect(() => {
    res.json({
      error: "Database connection error, please try again later",
    });
  }, next);
});

// set up routes
app.use("/auth", authRoutes);

Server.buildServices(app);

// Just checking if given PORT variable is an integer or not
let port = parseInt(process.env.PORT || "");
if (isNaN(port) || port === 0) {
  port = 8888;
}

app.listen(port, () => {
  console.log(`Server Started at PORT: ${port}`);
});
