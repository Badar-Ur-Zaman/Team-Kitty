import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove authentication token
    localStorage.removeItem("role");  // Optional: Remove user role
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div>
      {/* Show Logout button if authenticated */}
      {isAuthenticated && (
          <button style={logoutButtonStyle} onClick={handleLogout}>Logout</button>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/PatientDashboard" element={<PatientDashboard />} />
        <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
      </Routes>
    </div>
  );
}

/* Styles for Navbar */
const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#2c3e50",
  padding: "10px 20px",
  color: "white",
};

/* Styles for Logo */
const logoStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
};

/* Styles for Logout Button */
const logoutButtonStyle = {
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  padding: "8px 15px",
  fontSize: "1rem",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "0.3s",
};

logoutButtonStyle[":hover"] = {
  backgroundColor: "#c0392b",
};

export default App;
