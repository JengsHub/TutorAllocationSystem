import React, { useEffect, useState } from "react";
import { Route, Switch, useParams } from "react-router-dom";
import baseApi from "./apis/baseApi";
import AdminSidebar from "./components/AdminSidebar";
import Sidebar from "./components/Sidebar";
import AdminLecturing from "./pages/AdminActivities/AdminLecturing";
// import Activities from "./pages/Activities";
import Dashboard from "./pages/Dashboard";
import DataImport from "./pages/DataImport";
import Lecturing from "./pages/Lecturing/Lecturing";
import NotFound from "./pages/NotFound";
// import Preferences from "./pages/Preferences";
import Profile from "./pages/Profile";
import Rules from "./pages/Rules";
import Staff from "./pages/Staff/Staff";
import Swapping from "./pages/Swaps/Swapping";
import SwappingLecturer from "./pages/Swaps/SwappingLecturer";
import SwappingWorkforce from "./pages/Swaps/SwappingWorkforce";
import UnitRoles from "./pages/UnitRoles";
import Units from "./pages/Units";
import PrivateRoute from "./PrivateRoute";
// import Candidate from "./pages/Candidate";
import { AuthContext } from "./session";

const Routes = () => {
  const [isAuth, setAuth] = useState(false);
  const [adminAccess, setAdminAccess] = useState(false);

  const params = useParams();
  useEffect(() => {
    // Check if user is logged in every time they change page
    const fetchAuthState = async () => {
      const res = await baseApi.get("/auth/login/success");
      if (res.status === 401) {
        setAuth(false);
      } else {
        setAuth(true);
        const resData = await res.data;
        setAdminAccess(resData.user.adminAccess);
      }
    };
    fetchAuthState();
  }, [params]);

  console.log(`isAuth: ${isAuth}, adminAccess: ${adminAccess}`);

  if (adminAccess) {
    return (
      <AuthContext.Provider
        value={{ isAuth, setAuth, adminAccess, setAdminAccess }}
      >
        <AdminSidebar />
        <Switch>
          <PrivateRoute
            isAuthenticated={isAuth}
            path="/"
            exact
            component={Dashboard}
          />
          <PrivateRoute
            isAuthenticated={isAuth}
            path="/activities"
            component={AdminLecturing}
          />
          <PrivateRoute
            isAuthenticated={isAuth}
            path="/staff"
            component={Staff}
          />
          <PrivateRoute
            isAuthenticated={isAuth}
            path="/swappingWorkforce"
            component={SwappingWorkforce}
          />
          <PrivateRoute
            isAuthenticated={isAuth}
            path="/dataimport"
            component={DataImport}
          />
          <PrivateRoute
            isAuthenticated={isAuth}
            path="/rules"
            component={Rules}
          />
          <PrivateRoute
            isAuthenticated={isAuth}
            path="/unitroles"
            component={UnitRoles}
          />

          <Route path="/profile" component={Profile} />
          <PrivateRoute isAuthenticated={isAuth} component={NotFound} />
        </Switch>
      </AuthContext.Provider>
    );
  } else {
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
            path="/offering"
            component={Lecturing}
          />
          <PrivateRoute
            isAuthenticated={isAuth}
            path="/swapping"
            component={Swapping}
          />
          <PrivateRoute
            isAuthenticated={isAuth}
            path="/swappingLecture"
            component={SwappingLecturer}
          />
          {/* <PrivateRoute
            isAuthenticated={isAuth}
            path="/staff"
            component={Staff}
          /> */}
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
          <Route path="/profile" component={Profile} />
          <PrivateRoute isAuthenticated={isAuth} component={NotFound} />
        </Switch>
      </AuthContext.Provider>
    );
  }
};

export default Routes;
