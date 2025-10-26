
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {

    const navigate = useNavigate();
    const { user, setIsAuthenticated, setUser, setToken } = useAuth();

    const handleLogout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      navigate("/login");
    };

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
        justifyContent: "space-between",
    }}
  >
    <h1 style={{ fontSize: "1.3rem", margin: 0, letterSpacing: "1px", fontWeight: 700 , cursor: "pointer"}} onClick={() => navigate("/")}>
      LeadApp
    </h1>

   {user && <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span>Hi, {user?.name}</span>
      <span
        title="Logout"
        onClick={handleLogout}
        style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "0.5rem", color: "#eebbc3" }}
        role="button"
        tabIndex={0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </span>
    </nav>}
  </header>
);
};

export default Header;
