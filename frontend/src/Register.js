import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css"; // Import CSS for styling

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [age, setAge] = useState(""); // Age for Patient
  const [expertise, setExpertise] = useState(""); // Expertise for Doctor
  const [timing, setTiming] = useState(""); // Timing for Doctor
  const [error, setError] = useState(""); // Error handling

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === "Patient" && age <= 10) {
      setError("Age must be greater than 10 for registration.");
      return;
    }

    setError(""); // Clear previous errors

    let userData = {
      name,
      email,
      password,
      role,
    };

    if (role === "patient") {
      userData.age = Number(age); // Include age only for Patients
    } else if (role === "doctor") {
      userData.expertise = expertise;
      userData.availableTimings = timing; // Include expertise and timing only for Doctors
    }

    console.dir("Registering:", userData);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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

        {role === "patient" && (
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        )}

        {role === "doctor" && (
          <>
            <select value={expertise} onChange={(e) => setExpertise(e.target.value)} required>
              <option value="">Select Expertise</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Neurologist">Neurologist</option>
            </select>

            <select value={timing} onChange={(e) => setTiming(e.target.value)} required>
              <option value="">Select Timing</option>
              <option value="9am - 11am">9am - 11am</option>
              <option value="11am - 1pm">11am - 1pm</option>
              <option value="1pm - 3pm">1pm - 3pm</option>
              <option value="3pm - 5pm">3pm - 5pm</option>
            </select>
          </>
        )}

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
