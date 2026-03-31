import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'
import { saveRoomKey } from '../utils/indexDB';
import {exportPrivateKey } from '../utils/rsa';

function Login({ setIsAuthenticated }) {

  const [form, setForm] = useState({ identity: "", password: "" });
  const privateKeyRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleKeyUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const text = await file.text();

    try {
      const pem = text
        .replace("-----BEGIN PRIVATE KEY-----", "")
        .replace("-----END PRIVATE KEY-----", "")
        .replace(/\n/g, "");

      const binary = Uint8Array.from(atob(pem), c => c.charCodeAt(0));

      const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        binary.buffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        true,
        ["decrypt"]
      );
      const exportKey = await exportPrivateKey(privateKey)

      await saveRoomKey(exportKey)



      privateKeyRef.current = privateKey;

      alert("Private key loaded successfully ✅");

    } catch (err) {
      console.error(err);
      alert("Invalid private key ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!privateKeyRef.current) {
      alert("Please upload your private key first");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Users/login`,
        form,
        { withCredentials: true }
      );

      localStorage.setItem("getProfile", JSON.stringify(res.data.data));

      setIsAuthenticated(true);
      navigate("/Dashboard");

    } catch (error) {
      console.error(error);
      alert("Login failed!");
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-white-900'>
      <form onSubmit={handleSubmit} className='bg-white-800 p-6 rounded-lg shadow-lg w-80'>

        <h2 className='text-2xl font-bold mb-4'>Login</h2>

        <input
          name="identity"
          placeholder='Username or email'
          onChange={handleChange}
          className='w-full p-2 mb-2 rounded'
        />

        <input
          name="password"
          type='password'
          placeholder='Password'
          onChange={handleChange}
          className='w-full p-2 mb-4 rounded'
        />

        <input
          type="file"
          accept=".pem"
          onChange={handleKeyUpload}
          className="mb-3"
        />

        <button className='w-full bg-green-500 p-2 rounded text-white'>
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <Link to="/Signup" className="text-blue-500 hover:underline">
            Create one here
          </Link>
        </div>

      </form>
    </div>
  );
}

export default Login;