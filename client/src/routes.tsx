import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import Staff from "./pages/Staff";
import Units from "./pages/Units";
import Preferences from "./pages/Preferences";
import Activities from "./pages/Activities";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import ProtectedRoutes from "./components/ProtectedRoutes";
import DataImport from "./pages/DataImport";

const PrivateRoutes = () => {
  return (
    <BrowserRouter>
      <Sidebar />
      <Switch>
        <ProtectedRoutes path="/home" exact component={Dashboard} />
        <ProtectedRoutes path="/dataimport" component={DataImport} />
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
