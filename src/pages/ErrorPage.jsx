import React from "react";

const ErrorPage = () => (
  <div style={{
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#646cff"
  }}>
    <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>404</h1>
    <div style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>Page Not Found</div>
    <a href="/" style={{ color: "#646cff", textDecoration: "underline", fontWeight: 500 }}>Go to Dashboard</a>
  </div>
);

export default ErrorPage;
