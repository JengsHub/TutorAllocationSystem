import * as React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

const ProtectedRoute: React.FC<RouteProps> = ({
  component: Component,
  ...rest
}) => {
  if (!Component) return null;
  //auth.login(); //i am manualy setting it to true because I dont know how to transfer the true value from GoogleBtn yet
  //to test the linking from page 1 to page 2, uncomment the line above^
  return (
    <div>
      <Route
        {...rest}
        render={
          (props) =>
            sessionStorage.getItem("isAuth") == "true" ? ( //if true, redirect to the requested page
              <Component {...props} />
            ) : (
              <Redirect to="/" />
            ) //else, go back to login page/homepage
        }
      />
    </div>
  );
};

export default ProtectedRoute;
