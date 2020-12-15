import axios from "axios";

//this file is to find and link database to the front end part
export default axios.create({
  baseURL: "http://localhost:8888",
});
