import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../images/logofull.png";
import AdminSidebarItems from "./AdminSidebarItems";
import "./styles/Sidebar.css";

const AdminSidebar = () => {
  return (
    <>
      <div className="sidebar">
        <img src={logo} alt="logo" className="logo"></img>
        {AdminSidebarItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.route}
            activeClassName={item.route === "/" ? "" : "active"}
            className="link"
          >
            <div className="sidebar-item" key={item.name}>
              <p>{item.name}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default AdminSidebar;
