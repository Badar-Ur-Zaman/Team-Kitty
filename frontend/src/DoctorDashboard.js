import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css"; // Import separate CSS

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [recommendations, setRecommendations] = useState({}); // Store recommendations per patient
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token found
    }
  }, [navigate]);

  // Fetch patients' data from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/patients", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data fetched: ", data);
        setPatients(data.patients || []); // Ensure we're accessing the correct array
      })
      .catch((error) => console.error("Error fetching patients:", error));
  }, []);

  // Handle showing recommendation input
  const handleAddRecommendation = (patientId) => {
    setRecommendations((prev) => ({
      ...prev,
      [patientId]: { text: "", isVisible: true },
    }));
  };

  // Handle recommendation text change
  const handleRecommendationChange = (patientId, value) => {
    setRecommendations((prev) => ({
      ...prev,
      [patientId]: { ...prev[patientId], text: value },
    }));
  };

  const handleSubmitRecommendation = async (patientId, reportId) => {
    const recommendationText = recommendations[patientId]?.text;
    if (!recommendationText.trim()) return;
  
    try {
      const response = await fetch("http://localhost:5000/api/patients/add-instruction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId, reportId, instruction: recommendationText }),
      });
  
      if (response.ok) {
        console.log("Instruction submitted successfully");
        setRecommendations((prev) => ({
          ...prev,
          [patientId]: { text: "", isVisible: false },
        }));
      } else {
        console.error("Failed to submit instruction");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  

  return (
    <div className="doctor-dashboard">
      <h2>Doctor Dashboard</h2>
      <div className="patients-section">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <div key={patient._id} className="patient-box">
              <h3>{patient.name}</h3>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Symptoms:</strong> {patient.symptoms}</p>

              <h4>Reports</h4>
              {patient.reports && patient.reports.length > 0 ? (
                patient.reports.map((report, index) => (
                  <div key={index} className="report-box">
                    <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
                    <p><strong>Content:</strong> {report.content}</p>
                    <p><strong>Instructions:</strong> {report.instructions || "No instructions provided yet."}</p>
                  </div>
                ))
              ) : (
                <p>No reports available.</p>
              )}

              {/* Add Recommendation Button */}
              {!recommendations[patient._id]?.isVisible && (
                <button onClick={() => handleAddRecommendation(patient._id)}>
                  Add Instructions
                </button>
              )}

              {/* Recommendation Textarea */}
              {recommendations[patient._id]?.isVisible && (
                <div className="recommendation-section">
                  <textarea
                    placeholder="Enter instructions for the patient..."
                    value={recommendations[patient._id]?.text || ""}
                    onChange={(e) =>
                      handleRecommendationChange(patient._id, e.target.value)
                    }
                  ></textarea>
                  <button onClick={() => handleSubmitRecommendation(patient._id, patient.reports[0]._id)}>
                    Submit
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No patients available.</p>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
