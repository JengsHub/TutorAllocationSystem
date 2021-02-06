import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import passport from "passport";
import { shouldSendSameSiteNone } from "should-send-same-site-none";
import { getConnection } from "typeorm";
import { TypeormStore } from "typeorm-store";
import { Server } from "typescript-rest";
import { config } from "./config";
import { NodemailerEmailHelper } from "./email/emailHelper";
import { Session } from "./entity/Session";
import { DBConnect, TryDBConnect } from "./helpers";
import { authCheckMiddleware } from "./helpers/auth";
import "./services"; // Importing all services
import authRoutes from "./services/AuthService";
import { swaggerDocument } from "./swagger";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const initServer = async () => {
  const app: express.Application = express();

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  fs.writeFile("swaggerDoc.json", JSON.stringify(swaggerDocument), (e) => {
    if (e) {
      console.log(e);
    }
  });

  app.use(async (req: Request, res: Response, next) => {
    await TryDBConnect(() => {
      res.json({
        error: "Database connection error, please try again later",
      });
    }, next);
  });

  await DBConnect();

  // Cookie and session settings
  app.use(shouldSendSameSiteNone);
  app.set("trust proxy", 1); // trust first proxy
  let cookieOptions: session.SessionOptions = {
    store: new TypeormStore({
      repository: getConnection().getRepository(Session),
    }),
    name: "sid",
    proxy: true,
    secret: ["ioq2sdjkabf891234!@#^SDAIOFq239as"],
    cookie: {
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
    rolling: true, // automatically set new expiration when user makes request
    resave: true,
    saveUninitialized: false, // do no set cookie if user is not authenticated
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.cookie = {
      ...cookieOptions.cookie,
      secure: true,
      sameSite: "none",
    };
  }
  app.use(session(cookieOptions));

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

  // Middleware to require authentication for routes
  const authenticatedRoutes = [
    "/activities",
    "/allocations",
    "/availabilities",
    "/roles",
    "/rules",
    "/staffpreferences",
    "/staff",
    "/statuslog",
    "/swaps",
    "/units",
    "/upload",
  ];

  for (const route of authenticatedRoutes) {
    app.use(route, authCheckMiddleware);
  }

  // Build routes
  Server.buildServices(app);

  // Health check route for AWS
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
