import * as Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { isQualifiedName } from "typescript";

// export const getAuthState: any = () => {
//   /**If session cookie "sid" exists, the user is already logged in.
//    * When the user logout, the backend will clear the session cookie from its store
//    * and also on the client side (frontend)
//    *
//    * Note: the current session setting allow js scripts to access the cookie (i.e. not HttpOnly)
//    * so this could be a security concern? May want to look into JWT authentication
//    */

//   //  TODO: do an actual call to the backend to check if the cookie is valid
//   // const sessionCookie = Cookies.get("sid");
//   // if (sessionCookie === undefined) {
//   //   return false;
//   // } else {
//   //   return true;
//   // }

//   const [isAuth, setAuth] = useState(false);
//   useEffect(() => {
//     const fetchAuthState = async () => {
//       const authRes = await fetch("http://localhost:8888/auth/login/success", {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Credentials": "true",
//         },
//       });

//       if (authRes.status === 401) {
//         return setAuth(false);
//       } else {
//         return setAuth(true);
//       }
//     };
//     fetchAuthState();
//   }, [isAuth]);

//   return isAuth;
// };

// TODO: create hook to allow modifying auth state
const defaultAuthContext: { isAuth: boolean; setAuth: any } = {
  isAuth: false,
  setAuth: () => {},
};
export const AuthContext = React.createContext(defaultAuthContext);
