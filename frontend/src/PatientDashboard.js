import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css"; // Import separate CSS

function PatientDashboard() {
  const [isTextareaVisible, setIsTextareaVisible] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [reports, setReports] = useState([]); // Updated state to store reports
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token found
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Fetching reports...");
    
    fetch("http://localhost:5000/api/patient/reports", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data fetched:", data);
        setReports(data.reports || []); // Store reports in state
      })
      .catch((error) => console.error("Error fetching reports:", error));
  }, []);

  // Handle submitting issue to backend
  const handleIssueSubmit = async () => {
    if (!issueText.trim()) return; // Prevent empty submissions

    try {
      console.log("Submitting issue:", issueText);

      const response = await fetch("http://localhost:5000/api/patient/generate-report", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: issueText }),
      });

      console.log("Response: ", response);

      if (response.ok) {
        console.log("Issue submitted successfully");
        setIssueText(""); // Clear input field
        setIsTextareaVisible(false); // Hide textarea
      } else {
        console.error("Failed to submit issue");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    setIssueText(""); // Clear the input field
    setIsTextareaVisible(false); // Hide the text box
  };

  return (
    <div className="patient-dashboard">
      {/* Top Section */}
      <div className="issue-section">
        <button onClick={() => setIsTextareaVisible(true)}>Report Issue</button>
        {isTextareaVisible && (
          <div className="textarea-container">
            <textarea
              placeholder="Describe your issue..."
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
            ></textarea>
            <div className="button-group">
              <button onClick={handleIssueSubmit}>Done</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: Reports */}
      <div className="reports-section">
        <h3>Your Reports</h3>
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <div key={index} className="report-box">
              <h4>Report {index + 1}</h4>
              <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
              <p><strong>Content:</strong> {report.content}</p>
              <p><strong>Instructions:</strong> {report.instructions ? report.instructions : "No specific instructions from the doctor."}</p>
            </div>
          ))
        ) : (
          <p>No reports available.</p>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
