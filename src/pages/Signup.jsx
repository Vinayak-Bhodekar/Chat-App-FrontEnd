import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { generateRSAKeyPair, exportPrivateKey, exportPublicKey } from "../utils/rsa";
import { saveRoomKey } from "../utils/indexDB";

function Signup({ setIsAuthenticated }) {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: ""
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup"); // signup | otp
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- SEND OTP ---------------- */
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("")
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Users/OTPsender`, {
        email: form.email
      });

      setMessage("OTP sent successfully!");
      setStep("otp");
    } catch (error) {
      if (error.response?.data?.errors?.statusCode === 401) {
      setMessage("Email already registered. Please login.");
    } else {
      setMessage("Failed to send OTP. Try again.");
    }
    }
  };

  async function downloadPrivateKey(privateKey,form) {
  const exported = await crypto.subtle.exportKey("pkcs8", privateKey);

  const base64 = btoa(
    String.fromCharCode(...new Uint8Array(exported))
  );

  const pem = `-----BEGIN PRIVATE KEY-----
${base64.match(/.{1,64}/g).join("\n")}
-----END PRIVATE KEY-----`;

  const blob = new Blob([pem], { type: "application/x-pem-file" });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${form?.userName}-private_key.pem`;
  a.click();

  window.URL.revokeObjectURL(url);
}


  const handleVerifyOTPAndRegister = async (e) => {
    e.preventDefault();

    try {
      // 1️ Verify OTP
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Users/OTPVerification`,
        { otp, email: form.email }
      );

      // 2️ Generate RSA keys
      const { publicKey, privateKey } = await generateRSAKeyPair();

      const publicKeyBase64 = await exportPublicKey(publicKey);

      // 3️ DOWNLOAD PRIVATE KEY (IMPORTANT PART)
      await downloadPrivateKey(privateKey,form);

      // 4️ Register user (ONLY public key goes to backend)
      const payload = { ...form, publicKey: publicKeyBase64 };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Users/register`,
        payload,
        { withCredentials: true }
      );

      alert(" Signup successful! Private key downloaded. Keep it safe ");

      navigate("/Login");

    } catch (error) {
      setMessage("OTP verification failed");
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">

        {/* 🔙 Back Button (OTP → Signup) */}
        {step === "otp" && (
          <button
            onClick={() => setStep("signup")}
            className="absolute left-3 top-3 text-sm text-blue-500 hover:underline"
          >
            ← Back
          </button>
        )}

        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === "signup" ? "Sign Up" : "Verify Email"}
        </h2>

        {/* ---------------- SIGNUP FORM ---------------- */}
        <button
            onClick={() => navigate("/Login")}
            className="absolute left-3 top-3 text-sm text-blue-500 hover:underline"
          >
            ← Back
        </button>
        {step === "signup" && (
          <form onSubmit={handleSendOTP}>

            <input
              name="firstName"
              placeholder="Firstname"
              onChange={handleChange}
              className="w-full p-2 mb-2 rounded shadow"
              required
            />

            <input
              name="lastName"
              placeholder="Lastname"
              onChange={handleChange}
              className="w-full p-2 mb-2 rounded shadow"
              required
            />

            <input
              name="userName"
              placeholder="Username"
              onChange={handleChange}
              className="w-full p-2 mb-2 rounded shadow"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded shadow"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full mb-4 rounded p-2 shadow"
              required
            />

            <button className="w-full bg-blue-500 p-2 rounded text-white">
              Send OTP
            </button>
          </form>
        )}

        {/* ---------------- OTP FORM ---------------- */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOTPAndRegister}>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-2 mb-4 border rounded"
              required
            />

            <button className="w-full bg-green-500 p-2 rounded text-white">
              Verify & Register
            </button>
          </form>
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

export default Signup;
