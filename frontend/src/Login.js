import React, { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Import separate CSS for login

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Role selection
  const [error, setError] = useState(""); // For displaying errors

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
      role
    };

    console.log("Sending data:", loginData);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        // Redirect user or store JWT token
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);

        if (role === "patient") {
          navigate("/PatientDashboard");
        } else if (role === "doctor") {
          navigate("/DoctorDashboard");
        } else {
          setError("Invalid role received from server");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Failed to connect to the server");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
