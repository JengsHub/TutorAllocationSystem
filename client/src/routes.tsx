import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Activities from "./pages/Activities";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Preferences from "./pages/Preferences";
import Profile from "./pages/Profile";
import Staff from "./pages/Staff";
import { AuthContext, getAuthState } from "./session";

const Routes = () => {
  const [isAuth, setAuth] = useState(getAuthState());

  // Update auth state when user login or logout
  useEffect(() => {
    setAuth(getAuthState());
  }, [isAuth]);

  return (
    <AuthContext.Provider value={isAuth}>
      <BrowserRouter>
        <Sidebar />
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/staff" component={Staff} />
          <Route path="/preferences" component={Preferences} />
          <Route path="/activities" component={Activities} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default Routes;
