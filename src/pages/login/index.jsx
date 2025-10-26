import React, { useState } from "react";
import "./index.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setIsAuthenticated, setUser, setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await fetch("http://localhost:8081/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
    
      const data = await response.json();

      if (data.status === "success") {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authUser", JSON.stringify(data.user));
        setToken(data.token);
        navigate("/", { replace: true });
      } else {
        setLoginError(data.message || "Invalid email or password.");
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    }
  };

  return (
    <div className="form-page">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="form-title">Login</h2>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="form-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Login</button>
        </div>
        {loginError && (
          <div className="form-error" style={{ marginTop: "0.7rem", textAlign: "center" }}>{loginError}</div>
        )}
      </form>
    </div>
  );
};

export default Login;