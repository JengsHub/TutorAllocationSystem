import React, { useEffect, useState } from "react";
import { Route, Switch, useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar";
// import Activities from "./pages/Activities";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import DataImport from "./pages/DataImport";
import Lecturing from "./pages/Lecturing";
import NotFound from "./pages/NotFound";
// import Preferences from "./pages/Preferences";
import Profile from "./pages/Profile";
import Staff from "./pages/Staff";
import Units from "./pages/Units";
import PrivateRoute from "./PrivateRoute";
import { AuthContext } from "./session";

const Routes = () => {
  const [isAuth, setAuth] = useState(false);
  const [adminAccess, setAdminAccess] = useState(false);

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
        setAuth(false);
      } else {
        setAuth(true);
        const resJson = await authRes.json();
        setAdminAccess(resJson.user.adminAccess);
      }
    };
    fetchAuthState();
  }, [params]);

  console.log(`isAuth: ${isAuth}, adminAccess: ${adminAccess}`);

  return (
    <AuthContext.Provider
      value={{ isAuth, setAuth, adminAccess, setAdminAccess }}
    >
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
          path="/lecturing"
          component={Lecturing}
        />
        <PrivateRoute
          isAuthenticated={isAuth}
          path="/staff"
          component={Staff}
        />
        {/* <PrivateRoute
          isAuthenticated={isAuth}
          path="/preferences"
          component={Preferences}
        /> */}
        {/* <PrivateRoute
          isAuthenticated={isAuth}
          path="/activities"
          component={Activities}
        /> */}
        <PrivateRoute
          isAuthenticated={isAuth}
          path="/dataimport"
          component={DataImport}
        />
        <PrivateRoute
          isAuthenticated={isAuth}
          path="/admin"
          component={Admin}
        />
        <Route path="/profile" component={Profile} />
        <PrivateRoute isAuthenticated={isAuth} component={NotFound} />
      </Switch>
    </AuthContext.Provider>
  );
};

export default Routes;
