import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./index.css";

const Card = ({ title, value, icon }) => (
  <div className="dashboard-card">
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

  return (
    <div className="dashboard-container">
      {isAdmin && (
        <Card title="Users" value={stats.total_users} icon={"👤"} />
      )}
      <Card title="Leads" value={stats.total_leads} icon={"📋"} />
      <Card title="Customers" value={stats.total_customers} icon={"💼"} />
    </div>
  );
};

export default Dashboard;
