import React from "react";
import {Outlet} from "react-router-dom";

const Layout = () => {
  return (
    <div className="App">
      <div className="App-header">
        Words of the Week
      </div>

      <Outlet />
    </div>
  );
};

export default Layout;
