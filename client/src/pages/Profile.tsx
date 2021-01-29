import React, { useEffect, useState } from "react";
import baseApi from "../apis/baseApi";
import { config } from "../config";
import { AuthContext } from "../context/session";
/*
 * Page: Profile
 * This is where the login and logout buttosn are located
 * Users will use this page to login and logout from the application using their google accounts
 */
const Profile = () => {
  const { isAuth } = React.useContext(AuthContext); // TODO: create context hook for updating value
  const [user, setUser] = useState({});

  // TODO: loading state
  useEffect(() => {
    getProfile();
  }, [isAuth]);

  const getProfile = async () => {
    const authRes = await baseApi.get(`auth/login/success`);
    if (authRes.status !== 200) {
      return;
    }

    const resBody = await authRes.data;
    try {
      setUser(resBody.user);
    } catch {
      // setError("Error fetch user profile");
    }
  };

  const logout = async () => {
    window.open(`${config.url.API_URL}/auth/google/logout`, "_self");
  };

  const login = async () => {
    window.open(`${config.url.API_URL}/auth/google`, "_self");
  };

  return (
    <div id="main">
      <h1> Profile </h1>
      {isAuth ? (
        <>
          <div>Logged in</div>
          <div>
            Email:{" "}
            {
              //@ts-ignore
              user.email
            }
          </div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <div>Please login to view your profile</div>
          <button onClick={login}>Login with Google</button>
        </>
      )}{" "}
    </div>
  );
};

export default Profile;
