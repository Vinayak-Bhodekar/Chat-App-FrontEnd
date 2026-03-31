import { useEffect, useState, useRef, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import axios from 'axios';
import Dashboard from "./pages/Dashboard"
import VerifyEmail from './pages/VerifyEmail';
import socket from './socket';
import useProfile from './hooks/UserHook/useProfile';
import { initAES } from './utils/crypto';
import authenticateContext from './contexts/authenticateContext/authenticateContext';

axios.defaults.withCredentials = true;

function App() {

  const { isAuthenticated, setIsAuthenticated, loading } = useContext(authenticateContext);

  useEffect(() => {
    initAES();
  }, []);

  if (loading) return <p className='flex items-center justify-center min-h-screen'>Loading...</p>

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} /> : <Navigate to="/login" />} replace />
        <Route path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  )
}

export default App
