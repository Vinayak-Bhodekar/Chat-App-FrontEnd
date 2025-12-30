import React, { useContext, useState } from 'react'
import FriendRequest from './FriendRequest'
import { useNavigate } from 'react-router-dom'
import AddFriend from './AddFriend'
import themeContext from '../contexts/themeContext/themeContext'

function AddFriendDashboard({ contacts, friendRequests = [], onBack}) {
  const navigate = useNavigate()
  const {darkMode,setDarkMode} = useContext(themeContext)
  const [activeTab, setActiveTab] = useState("add")

  const handleBackButton = async (e) => {
    e.preventDefault()
    console.log("press back button")
    navigate("/Dashboard")
  }

  return (
    <div className='h-screen flex flex-col bg-gray-100'>

      {/* Top navigator bar */}
      <div className={`flex items-center justify-between p-4 ${darkMode ? "bg-slate-900":"bg-white"} shadow-md`}>
        {/* Back Button */}
        <button
          className={`${darkMode?"text-white":"text-black"} font-semibold hover:underline`}
          onClick={onBack}
        >
          ← Back
        </button>

        {/* Tab Buttons */}
        <div className='space-x-3 flex items-center'>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 rounded-lg ${activeTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Add Friend
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`relative px-4 py-2 rounded-lg ${activeTab === "requests" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Friend Requests
            {friendRequests.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {friendRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main section */}
      <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-slate-700":"bg-white"}`}>
        {activeTab === "add"
          ? <AddFriend contacts={contacts} />
          : <FriendRequest contacts={contacts} friendRequests={friendRequests} />}
      </div>
    </div>
  )
}

export default AddFriendDashboard
