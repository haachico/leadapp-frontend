import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => (
  <>
    {/* <Header /> */}
    <main style={{ padding: "1rem", minHeight: "100vh", width: "100vw", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      <Outlet />
    </main>
  </>
);

export default Layout;
