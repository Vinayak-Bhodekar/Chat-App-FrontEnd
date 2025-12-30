import axios from 'axios'
import React, { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../pages/Login'
import socket from '../socket'
import themeContext from '../contexts/themeContext/themeContext'

function Setting({setIsAuthenticated}) {

    const navigate = useNavigate()

    const {darkMode,setDarkMode} = useContext(themeContext)
    const [notifications,setNotification] = useState("false")

    const handleLogOut = async (e) => {
        e.preventDefault()

        try {
            await axios.get("http://localhost:9000/api/Users/logout",{withCredentials:true})
            
            localStorage.removeItem("getProfile");

            if(socket.connected) {
                socket.disconnect()
            }

            setIsAuthenticated(false)

            navigate("/login")

        } catch (error) {
            console.log("Error in Logout",error)
        }
    }

  return (
    <div className='p-6'>
        <h2 className={`text-xl ${darkMode ? "text-white":"text-black"} font-semibold mb-4`}>Settings</h2>
        <div className='space-y-6 max-w-md'>
            <div className={`flex items-center justify-between ${darkMode ? "bg-slate-700 text-white" : "bg-white"}  p-4 rounded-lg shadow-sm`}>
                <div>
                    <h3 className='font-medium'>Dark Mode</h3>
                    <p className='text-sm text-gray-500'>Toggle dark/light theme</p>
                </div>
                <button onClick={() => setDarkMode(!darkMode)}
                    className={`px-3 py-1 rounded-lg ${darkMode ? "bg-blue-500 text-white":"bg-gray-200"}`}>
                    {darkMode ? "On" : "Off"}
                </button>
            </div>

            <div className={`flex items-center justify-between ${darkMode ? "bg-slate-700 text-white" : "bg-white"}  p-4 rounded-lg shadow-sm`}>
                <div>
                    <h3 className='font-medium'>Notifications</h3>
                    <p className='text-sm text-gray-500'>Enable or disable alerts</p>
                </div>
                <button>{notifications?"On":"off"}</button>
            </div>

            <div className={`${darkMode ? "bg-slate-700 text-white" : "bg-white"} p-4 rounded-lg shadow-sm`}>
                <h3 className='font-medium mb-2'>Account</h3>
                <button className='w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600'
                onClick={handleLogOut}>Logout</button>
            </div>
        </div>
    </div>
  )
}

export default Setting