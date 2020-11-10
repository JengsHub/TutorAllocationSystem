import React from "react";
import PrivateRoutes from "./routes";
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./components/ProtectedRoutes";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Route exact path = "/" component={LoginPage} />
        <ProtectedRoute path = "/home" component={PrivateRoutes}/>
      </BrowserRouter>
    </div>
  );
};

export default App;
