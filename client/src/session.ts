import * as Cookies from "js-cookie";
import React from "react";

export const getAuthState: any = () => {
  /**If session cookie "sid" exists, the user is already logged in.
   * When the user logout, the backend will clear the session cookie from its store
   * and also on the client side (frontend)
   * 
   * Note: the current session setting allow js scripts to access the cookie (i.e. not HttpOnly) 
   * so this could be a security concern? May want to look into JWT authentication
   */
  const sessionCookie = Cookies.get("sid");
  if (sessionCookie === undefined) {
    return false;
  } else {
    return true;
  }
};

// TODO: create hook to allow modifying auth state
export const AuthContext = React.createContext(getAuthState());
