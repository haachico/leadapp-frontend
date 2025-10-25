import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => (
  <>
    <Header />
    <main style={{ padding: "1rem" }}>
      <Outlet />
    </main>
  </>
);

export default Layout;
