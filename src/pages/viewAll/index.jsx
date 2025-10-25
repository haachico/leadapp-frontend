
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
    const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState("");
  const [editRow, setEditRow] = useState(null);

const FORM_FIELDS = {
  users: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text", required: false },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "role", label: "Role", type: "select", required: true, options: ["admin", "user"] },
  ],
  leads: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text", required: false },
    { name: "assigned_to", label: "Assigned To", type: "hidden", required: true },
  ],
  customers: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text", required: false },
    { name: "assigned_to", label: "Assigned To", type: "hidden", required: true },
  ],
};

const handleOpenModal = () => {
  setEditRow(null);
  setForm(type === "users" ? { role: "user" } : { assigned_to: user?.id });
  setFormError("");
  setShowModal(true);
};

const handleOpenEditModal = (row) => {
  setEditRow(row);
  // Only include fields shown in table (columns), but skip 'id'
  const editable = {};
  Object.keys(row).forEach((key) => {
    if (columns.includes(key) && key !== "id") editable[key] = row[key];
  });
  setForm(editable);
  setFormError("");
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
  setForm({});
  setFormError("");
  setEditRow(null);
};

const handleFormChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  // Only validate fields present in the form (edit: only table fields, skip id)
  const validateFields = editRow ? columns.filter(f => f !== "id") : FORM_FIELDS[type].map(f=>f.name);
  for (const field of validateFields) {
    if (!form[field] && field !== "phone") { // phone is optional
      setFormError(`${field.replace(/_/g, " ")} is required`);
      return;
    }
  }
  try {
    const url = editRow ? `${API_MAP[type]}/${editRow.id}` : API_MAP[type];
    const res = await fetch(url, {
      method: editRow ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const err = await res.json();
      setFormError(err.message || `Failed to ${editRow ? "update" : "create"}.`);
      return;
    }
    setShowModal(false);
    setForm({});
    setFormError("");
    setEditRow(null);
    window.location.reload();
  } catch (err) {
    setFormError(`Failed to ${editRow ? "update" : "create"}. Please try again.`);
  }
};

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

  console.log(showModal, "showModal")
  return (
    <div className="viewall-table-container">
      <div className="viewall-table-header">
        <h2 className="viewall-title">All {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
        <button className="viewall-create-btn" onClick={handleOpenModal}>
          Create {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
        </button>
      </div>
      {showModal && (
        <div className="viewall-modal-overlay">
          <div className="viewall-modal">
            <h3>{editRow ? `Edit ${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}` : `Create ${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}`}</h3>
            <form onSubmit={handleFormSubmit} className="viewall-modal-form">
              {editRow
                ? columns.filter(col => col !== "id").map((col) => (
                    <div className="form-group" key={col}>
                      <label className="form-label">{col.replace(/_/g, " ").toUpperCase()}</label>
                      <input
                        type={col === "email" ? "email" : "text"}
                        name={col}
                        value={form[col] || ""}
                        onChange={handleFormChange}
                        className="form-input"
                        required={col !== "phone"}
                      />
                    </div>
                  ))
                : FORM_FIELDS[type].map(field =>
                    field.type === "hidden" ? (
                      <input key={field.name} type="hidden" name={field.name} value={user?.id} />
                    ) : field.type === "select" ? (
                      <div className="form-group" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <select
                          name={field.name}
                          value={form[field.name] || ""}
                          onChange={handleFormChange}
                          className="form-input"
                          required={field.required}
                        >
                          <option value="" disabled>Select {field.label}</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="form-group" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name] || ""}
                          onChange={handleFormChange}
                          className="form-input"
                          required={field.required}
                        />
                      </div>
                    )
                  )}
              {formError && <div className="form-error">{formError}</div>}
              <div className="form-actions">
                <button type="submit" className="viewall-edit-btn" >{editRow ? "Update" : "Create"}</button>
                <button type="button" className="viewall-delete-btn" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
            {console.log(data, "data")}
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
                  <button className="viewall-edit-btn" onClick={() => handleOpenEditModal(row)}>Edit</button>
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