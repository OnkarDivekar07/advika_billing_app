import React, { useState } from "react";
import API from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import "./otpVerification.css";

function OtpVerificationPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/user/verifyOTP", { email, otp });

      if (response.data.success) {
        setIsVerified(true);
        setMessage("OTP verified successfully!");

        // ✅ Save JWT token to localStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        navigate("/billing");
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("FULL ERROR:", error.response || error);
      setMessage("An error occurred during OTP verification.");
    } finally {
      setLoading(false);
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
            maxLength={6}
            pattern="\d{6}"
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