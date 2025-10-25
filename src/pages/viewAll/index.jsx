
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./index.css";

const API_MAP = {
  users: "http://localhost:8081/api/users",
  leads: "http://localhost:8081/api/leads",
  customers: "http://localhost:8081/api/customers",
};

const ViewAll = () => {
  const { state } = useLocation();
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const type = state?.type || "leads";

useEffect(() => {
    const fetchData = async () => {
        const url = API_MAP[type];
        if (!url || !token) return;
        setLoading(true);
        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch data");
            const data = await res.json();
            setData(Array.isArray(data) ? data : data.data || []);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, [type, token]);

  if (loading) return <div className="viewall-loading">Loading...</div>;
  if (error) return <div className="viewall-error">{error}</div>;
  if (!data.length) return <div className="viewall-empty">No data found.</div>;

  const HIDE_COLS = ["assigned_to", "project_id", "created_at", "updated_at", "lead_id"];
 
  const columns = Object.keys(data[0]).filter(
    (key) => !HIDE_COLS.includes(key)
  );

  console.log(columns, "columns")
  return (
    <div className="viewall-table-container">
      <div className="viewall-table-header">
        <h2 className="viewall-title">All {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
        <button className="viewall-create-btn">
          Create {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)} +
        </button>
      </div>
      <div className="viewall-table-wrapper">
        <table className="viewall-table">
          <thead>
            <tr>
              {columns.map((key) => (
                <th key={key}>{key.replace(/_/g, " ").toUpperCase()}</th>
              ))}
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((key) => (
                  <td key={key}>
                    {type === "leads" && key === "status" ? (
                      <select
                        value={row.status}
                        onChange={e => {
                          const newStatus = e.target.value;
                          setData(prev => prev.map(r => r.id === row.id ? { ...r, status: newStatus } : r));
                        }}
                        className="viewall-status-dropdown"
                      >
                        {["New", "In-progress", "Converted", "Lost"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : key === "phone" && (!row[key] || row[key] === "null") ? "-" : row[key]}
                  </td>
                ))}
                <td>
                  <button className="viewall-edit-btn">Edit</button>
                  <button className="viewall-delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAll;