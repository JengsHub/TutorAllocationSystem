// Configure .env file
import dotenv from "dotenv";
const result = dotenv.config();

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
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";


import { NodemailerEmailHelper, SibEmailHelper } from "./email/emailHelper";
import fileUpload from "express-fileupload";

const initServer = async () => {
  const app: express.Application = express();

  const options = {
    swaggerDefinition: {
      info: {
        title: 'Hello World',
        version: '1.0.0',
      },
    },
    apis: ['src/services/*'],
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  if (result.error) {
    throw result.error;
  }

  app.use(async (req: Request, res: Response, next) => {
    await TryDBConnect(() => {
      res.json({
        error: "Database connection error, please try again later",
      });
    }, next);
  });

  await DBConnect();
  app.use(
    session({
      store: new TypeormStore({
        repository: getConnection().getRepository(Session),
      }),
      name: "sid",
      secret: ["ioq2sdjkabf891234!@#^SDAIOFq239as"],
      cookie: {
        httpOnly: true,
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

  // Just checking if given PORT variable is an integer or not
  let port = parseInt(process.env.PORT || "");
  if (isNaN(port) || port === 0) {
    port = 8888;
  }

  app.listen(port, () => {
    console.log(`Server Started at PORT: ${port}`);
  });
};
export const emailHelperInstance = new NodemailerEmailHelper();
initServer();
