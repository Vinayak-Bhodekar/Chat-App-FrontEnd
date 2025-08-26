import React, { useState } from 'react'
import FriendRequest from './FriendRequest'
import { useNavigate } from 'react-router-dom'
import AddFriend from './AddFriend'
import Dashboard from '../pages/Dashboard'
function AddFriendDashboard() {

  const navigate = useNavigate()

  const handleBackButton = async (e) => {
    e.preventDefault()

    console.log("press back button")
    navigate("/Dashboard")

  }

  const [activeTab, setActiveTab] = useState("add")
  

  return (
    <div className='h-screen flex flex-col bg-gray-100'>

      {/*Top navigator bar */}
      <div className='flex items-center justify-between p-4 bg-whit shadow-md'>
        {/*backButton */}
        <button className='text-blue-500 font-semibold hover:underline'
        onClick={(e) => handleBackButton(e)}></button>

        {/*Tab Buttons */}
        <div className='space-x-3'>
          <button onClick={() => setActiveTab("add")}
            className={`px-4 py-2 rounded-lg ${activeTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}>Add Friend</button>
            <button onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg ${activeTab === "requests" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}>Friend Requests</button>
        </div>
      </div>

      {/*Main section */}
      <div className='flex-1 overflow-y-auto p-4'>{activeTab === "add" ? <AddFriend />:<FriendRequest/>}</div>
    </div>
  )
}

export default AddFriendDashboard