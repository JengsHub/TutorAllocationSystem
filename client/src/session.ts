import React from "react";

// TODO: Better way for global state management?
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
