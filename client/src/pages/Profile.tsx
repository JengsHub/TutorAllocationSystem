import React, { useEffect, useState } from "react";
import { AuthContext } from "../session";
// import "../components/styles/Login.css";

const Profile = () => {
  const { isAuth } = React.useContext(AuthContext); // TODO: create context hook for updating value
  console.log("profile page:", isAuth);
  const [user, setUser] = useState({});
  // const [error, setError] = useState("");

  // TODO: loading state
  useEffect(() => {
    getProfile();
  }, [isAuth]);

  const getProfile = async () => {
    const authRes = await fetch("http://localhost:8888/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      },
    });

    if (authRes.status !== 200) {
      return;
    }

    const resBody = await authRes.json();
    // console.log(resBody);
    try {
      setUser(resBody.user);
    } catch {
      // setError("Error fetch user profile");
    }
  };

  const logout = async () => {
    window.open("http://localhost:8888/auth/google/logout", "_self");
  };

  const login = async () => {
    window.open("http://localhost:8888/auth/google", "_self");
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
