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
import cookieParser from "cookie-parser";
import { authCheck } from "./helpers/auth";
const passportSetup = require("./helpers/auth");

export const app: express.Application = express();

if (result.error) {
  throw result.error;
}
// set up session cookies
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration date
    keys: ["ioqwer902sdjkabf891234!@#^SDAIOFq239as"], // TODO: .env
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

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});
Server.buildServices(app);



// Just checking if given PORT variable is an integer or not
let port = parseInt(process.env.PORT || "");
if (isNaN(port) || port === 0) {
  port = 8888;
}

app.listen(port, () => {
  console.log(`Server Started at PORT: ${port}`);
});
