import React, { useState } from "react";
import API from "../api"; // Assuming API is correctly set up to handle OTP requests
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation to replace direct location
import "./otpVerification.css";
function OtpVerificationPage() {
  const [otp, setOtp] = useState(""); // Store OTP entered by the user
  const [message, setMessage] = useState(""); // Display success or error messages
  const [isVerified, setIsVerified] = useState(false); // Track if OTP is successfully verified
  const [loading, setLoading] = useState(false); // Track loading state for the API call
  const navigate = useNavigate();
  const location = useLocation(); // Get location object from useLocation hook

  const email = location.state?.email || ''; // Get email from location state (sent from LoginPage)

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    setLoading(true); // Start loading state
    try {
      // API call to verify OTP
      console.log("Before API call");
      const response = await API.post("/user/verifyOTP", { email, otp });
        console.log("hey i am here")
      if (response.data.success) {
        setIsVerified(true);
        setMessage("OTP verified successfully!");
        // Optionally redirect user to the next page (e.g., dashboard or home)
        navigate("/billing"); // Replace "/dashboard" with your destination
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
       console.error("FULL ERROR:", error.response || error);
  setMessage("An error occurred during OTP verification.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-form">
        <h1>OTP Verification</h1>
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6} // Assuming OTP is 6 digits
            pattern="\d{6}" // If OTP is always numeric, add pattern for validation
          />

          <div className="error-message" style={{ color: "red" }}>
            {message}
          </div>

          <button type="submit" className="verify-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="success-message" style={{ color: "green" }}>
            {isVerified && <p>OTP Verified Successfully!</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpVerificationPage;
