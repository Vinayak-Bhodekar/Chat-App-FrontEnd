import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyEmail({ email }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const handleOTPSending = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/Users/OTPsender`);
      setMessage("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      setMessage("Failed to send OTP");
      console.log(error);
    }
  };

  const handleResend = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/Users/OTPsender`);
      setMessage("OTP resent successfully!");
    } catch (error) {
      setMessage("Failed to resend OTP");
      console.log(error);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Users/OTPVerification`, { otp });
      setMessage("OTP verified successfully!");
      navigate("/Dashboard");
    } catch (error) {
      setMessage("Wrong OTP");
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 text-sm text-blue-500 hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-xl font-bold text-center mb-4">
          Verify Your Email
        </h2>

        <p className="text-sm text-gray-500 text-center mb-4">
          Enter the OTP
        </p>

        {!otpSent && (
          <form onSubmit={handleOTPSending}>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-2 mb-4 border rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Send OTP
            </button>
          </form>
        )}

        {otpSent && (
          <>
            <button
              onClick={handleResend}
              className="w-full mt-3 text-blue-500 underline"
            >
              Resend OTP
            </button>

            <form onSubmit={handleOTPVerification} className="mt-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-2 mb-2 border rounded"
              />

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Submit OTP
              </button>
            </form>
          </>
        )}

        {message && (
          <p className="text-center text-sm mt-3 text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
