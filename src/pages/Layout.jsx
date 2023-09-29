import React from "react";
import {Outlet, Link} from "react-router-dom";


const Layout = () => {
  return (
    <div className="App">
      <div className="App-header">
        <Link to="/words-of-the-week/" className="App-link">Words of the Week</Link>
      </div>

      <Outlet />
    </div>
  );
};

export default Layout;
