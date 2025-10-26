
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css"
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ViewAll from "./pages/viewAll";
import Header from "./components/Header";

// Placeholder Login and Dashboard components


function App() {

  return (
    <Router>
        <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/view-all" element={<ViewAll />} />
          {/* Add more protected routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
