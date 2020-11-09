import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Staff from "./pages/Staff";
import Preferences from "./pages/Preferences";
import Activities from "./pages/Activities";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";

const Routes = () => {
  return (
    <BrowserRouter>
      <Sidebar />
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/staff" component={Staff} />
        <Route path="/preferences" component={Preferences} />
        <Route path="/activities" component={Activities} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
