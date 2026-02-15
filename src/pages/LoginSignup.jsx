import React, { useState } from "react";
import API from "../api"; // API setup
import "./loginstyles.css"; 
import { useNavigate } from "react-router-dom"; // ✅ v6 hook

function LoginPage() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ useNavigate replaces useHistory

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
      const response = await API.post("/user/sendOTP", { email });

      if (response.data.success) {
        setOtpSent(true);
        setMessage("OTP sent to your email.");
        navigate("/verify-otp", { state: { email } }); // ✅ pass email in state
      } else {
        setMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while sending OTP.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {otpSent && (
            <div className="otp-message">
              <p>Check your inbox for the OTP.</p>
            </div>
          )}

          <div className="error-message" style={{ color: "red" }}>
            {message}
          </div>

          <button type="submit" className="login-btn">
            {otpSent ? "Resend OTP" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
