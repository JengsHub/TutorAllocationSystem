import React, { useEffect, useState } from "react";
import { Route, Switch, useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Activities from "./pages/Activities";
import Dashboard from "./pages/Dashboard";
import DataImport from "./pages/DataImport";
import NotFound from "./pages/NotFound";
import Preferences from "./pages/Preferences";
import Profile from "./pages/Profile";
import Staff from "./pages/Staff";
import Units from "./pages/Units";
import PrivateRoute from "./PrivateRoute";
import { AuthContext } from "./session";

const Routes = () => {
  const [isAuth, setAuth] = useState(false);
  const params = useParams();
  useEffect(() => {
    // Check if user is logged in every time they change page
    const fetchAuthState = async () => {
      const authRes = await fetch("http://localhost:8888/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
      });

      if (authRes.status === 401) {
        return setAuth(false);
      } else {
        return setAuth(true);
      }
    };
    fetchAuthState();
  }, [params]);

  return (
    <AuthContext.Provider value={{ isAuth: isAuth, setAuth: setAuth }}>
      <Sidebar />
      <Switch>
        <PrivateRoute
          isAuthenticated={isAuth}
          path="/"
          exact
          component={Dashboard}
        />
        <PrivateRoute
          isAuthenticated={isAuth}
          path="/unit"
          exact
          component={Units}
        />
        <PrivateRoute
          isAuthenticated={isAuth}
          path="/staff"
          component={Staff}
        />
        <PrivateRoute
          isAuthenticated={isAuth}
          path="/preferences"
          component={Preferences}
        />
        <PrivateRoute
          isAuthenticated={isAuth}
          path="/activities"
          component={Activities}
        />
        <PrivateRoute
          isAuthenticated={isAuth}
          path="/dataimport"
          component={DataImport}
        />
        <Route path="/profile" component={Profile} />
        <PrivateRoute isAuthenticated={isAuth} component={NotFound} />
      </Switch>
    </AuthContext.Provider>
  );
};

export default Routes;
