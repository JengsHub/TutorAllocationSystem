import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Staff from "./pages/Staff";
import ImportData from "./pages/ImportData"
import Units from "./pages/Units";
import Preferences from "./pages/Preferences";
import Activities from "./pages/Activities";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import ProtectedRoutes from "./components/ProtectedRoutes";

const PrivateRoutes = () => {
  return (
    <BrowserRouter>
      <Sidebar />
      <Switch>
        <ProtectedRoutes path="/home" exact component={Dashboard} />
        <ProtectedRoutes path="/importData" exact component={ImportData} />
        <ProtectedRoutes path="/unit" component={Units} />
        <ProtectedRoutes path="/staff" component={Staff} />
        <ProtectedRoutes path="/preferences" component={Preferences} />
        <ProtectedRoutes path="/activities" component={Activities} />
        <ProtectedRoutes component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default PrivateRoutes;
