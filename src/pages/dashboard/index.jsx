
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Card = ({ title, value, icon, onClick }) => (
  <div className="dashboard-card" onClick={onClick} style={{ cursor: "pointer" }}>
    <div className="dashboard-card-icon">{icon}</div>
    <div className="dashboard-card-content">
      <div className="dashboard-card-title">{title}</div>
      <div className="dashboard-card-value">{value}</div>
    </div>
  </div>
);


const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ total_leads: 0, total_customers: 0, total_users: 0 });
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8081/api/dashboard/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats({ total_leads: 0, total_customers: 0, total_users: 0 }));
  }, [user]);

  const handleCardClick = (type) => {
    navigate("/view-all", { state: { type } });
  };

  return (
    <div className="dashboard-container">
      {isAdmin && (
        <Card title="Users" value={stats.total_users} icon={"👤"} onClick={() => handleCardClick("users")} />
      )}
      <Card title="Leads" value={stats.total_leads} icon={"📋"} onClick={() => handleCardClick("leads")} />
      <Card title="Customers" value={stats.total_customers} icon={"💼"} onClick={() => handleCardClick("customers")} />
    </div>
  );
};

export default Dashboard;
