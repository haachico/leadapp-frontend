import React, { useState } from "react";
import "./index.css"
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const response = await fetch("http://localhost:8081/api/login", {
         method: "POST",
         headers: {
           "Content-Type": "application/json"
         },
         body: JSON.stringify({ email, password })
       });
       if (!response.ok) {
         throw new Error("Network response was not ok");
       }
       const data = await response.json();
       
       if(data.status === "success"){
            setIsAuthenticated(true);
    
       }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }  

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
      </form>
    </div>
  );
};

export default Login;