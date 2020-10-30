import express, {Request, Response} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {Server} from "typescript-rest";

// Importing all handlers
import './handlers';
import { TryDBConnect } from "./helpers";

export const app: express.Application = express();

// Configure .env file
const dotenv = require("dotenv");
const result = dotenv.config()
 
if (result.error) {
  throw result.error
}

app.use(cors());
app.use(bodyParser.json());

app.use(async (req: Request, res: Response, next) => {
  await TryDBConnect(() => {
    res.json({
      error: 'Database connection error, please try again later',
    });
  }, next);
});

Server.buildServices(app);

// Just checking if given PORT variable is an integer or not
let port = parseInt(process.env.PORT || "");
if (isNaN(port) || port === 0) {
  port = 8888;
}

app.listen(port, () => {
  console.log(`🚀 Server Started at PORT: ${port}`);
});