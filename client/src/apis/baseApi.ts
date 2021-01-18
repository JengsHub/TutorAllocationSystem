import axios from "axios";
import { config } from "../config";

//this file is to find and link database to the front end part
export default axios.create({
  baseURL: config.url.API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
  },
});
