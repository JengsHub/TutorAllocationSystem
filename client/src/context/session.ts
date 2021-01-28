import React from "react";

/* 
* Global state management 
* Allows for authenticated user and admin user
*/
const defaultAuthContext: {
  isAuth: boolean;
  setAuth: any;
  adminAccess: boolean;
  setAdminAccess: any;
} = {
  isAuth: false,
  setAuth: () => {},
  adminAccess: false,
  setAdminAccess: () => {},
};
export const AuthContext = React.createContext(defaultAuthContext);
