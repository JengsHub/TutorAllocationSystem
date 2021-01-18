// Configure .env file
import dotenv from "dotenv";
// const result = dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "typescript-rest";
// Importing all services
import "./services";
import { DBConnect, TryDBConnect } from "./helpers";
import authRoutes from "./services/AuthService";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { authCheckMiddleware } from "./helpers/auth";
import { getConnection } from "typeorm";
import { Session } from "./entity/Session";
import { TypeormStore } from "typeorm-store";
import { NodemailerEmailHelper, SibEmailHelper } from "./email/emailHelper";
import fileUpload from "express-fileupload";
import { config } from "./config";

const initServer = async () => {
  const app: express.Application = express();

  // if (result.error) {
  //   throw result.error;
  // }

  app.use(async (req: Request, res: Response, next) => {
    await TryDBConnect(() => {
      res.json({
        error: "Database connection error, please try again later",
      });
    }, next);
  });

  await DBConnect();
  app.set("trust proxy", 1); // trust first proxy
  app.use(
    session({
      store: new TypeormStore({
        repository: getConnection().getRepository(Session),
      }),
      name: "sid",
      proxy: true,
      secret: ["ioq2sdjkabf891234!@#^SDAIOFq239as"],
      cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
        secure: false, // TODO: set to true when https is set up
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
      origin: [config.CLIENT_URL, "http://localhost:3000"], // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true, // allow session cookie from browser to pass through
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // file upload middleware
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

  // set up routes
  app.use("/auth", authRoutes);

  // Middleware to require authentication for all routes in /units
  app.use("/units", authCheckMiddleware);
  app.use("/roles", authCheckMiddleware);
  // app.use("/upload", authCheckMiddleware, hasAdminAccessMiddleware);

  // app.use("/activities", authCheckMiddleware);

  Server.buildServices(app);
  app.get("/health", (req, res) => {
    res.status(200).send("Server is running");
  });

  // Just checking if given PORT variable is an integer or not
  let port = parseInt(config.PORT || "");
  if (isNaN(port) || port === 0) {
    port = 8888;
  }

  app.listen(port, () => {
    console.log(`Server Started at PORT: ${port}`);
  });
};

export const emailHelperInstance = new NodemailerEmailHelper();
initServer();
