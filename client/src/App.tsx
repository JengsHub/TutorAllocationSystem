import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";

const App = () => {
  console.log("Here in App");
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

export default App;
