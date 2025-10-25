import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {

    const navigate = useNavigate();
    const { user } = useAuth();
  return (
    <header
      style={{
        background: "#232946",
        color: "#fff",
        padding: "2rem 2rem",
      borderBottom: "2px solid #eebbc3",
      display: "flex",
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      cursor: "pointer",
        justifyContent: "space-between",
    }}
    onClick={() => navigate("/")}
  >
    <h1 style={{ fontSize: "1.3rem", margin: 0, letterSpacing: "1px", fontWeight: 700 }}>
      LeadApp
    </h1>

    <nav>
        Hi, {user?.name}
    </nav>
  </header>
);
};

export default Header;
