import React, { useContext, useState, useEffect } from 'react'
import ProfileCard from '../components/ProfileCard'
import EditProfile from '../components/EditProfile'
import FriendList from '../components/FriendList/FriendList'
import AddFriendDashboard from '../components/AddFriendDashboard'
import Setting from '../components/Setting'
import ChatBox from '../components/ChatBox/ChatBox.jsx'
import useProfile from '../hooks/UserHook/useProfile.js'
import socket from '../socket.js'
import useContact from '../hooks/FriendList/useContact.js'
import themeContext from '../contexts/themeContext/themeContext.js'
import axios from 'axios'
import friendRequestContext from '../contexts/friendRequestContext/friendRequestContext.js'

function Dashboard({ setIsAuthenticated }) {
 
  const { darkMode, setDarkMode } = useContext(themeContext)

  const [onlineUsers, setOnlineUsers] = useState({})
  const {friendRequests, clearRequests} = useContext(friendRequestContext)
  const [contacts, setContacts] = useState([])
  const contact = useContact()

  const [requests, setRequests] = useState([])
  
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/Request/incomingRequests",{withCredentials:true})
        setRequests(res.data.data)
      } catch (error) {
        console.log("error fetching requests",error)
      }
    }
    fetchRequests();
  },[]);

  // Set contacts
  useEffect(() => {
    try {
      if (contact?.contacts) {
        setContacts(contact.contacts)
      }
    } catch (error) {
      console.log("error in fetching contacts", error)
    }
  }, [contact?.contacts])


  // SOCKET LOGIC
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("getProfile"))

    if (!socket.connected) {
      socket.auth = { token: profile?._id }
      socket.connect()
    }

    socket.on("connect", () => {
      console.log("socket connected: ", socket.id)
    })

    socket.on("disconnect", () => {
      console.log("socket disconnected")
    })

    socket.on("user:status", ({ userId, status }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: status }))
    })

    
    socket.on("friend-added",async ({contact}) => {
      console.log(contact)
      setContacts((prev) => [...prev,contact])
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("user:status")
      
      socket.off("friend-added")
    }
  }, [])

  const [showEdit, setShowEdit] = useState(false)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [showSetting, setShowSetting] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className={`flex h-screen ${darkMode ? "bg-slate-900" : "bg-stone-50"}`}>

      {/* SIDEBAR */}
      <div className={`w-1/4 ${darkMode ? "bg-slate-800" : "bg-stone-300"} 
        border-r ${darkMode ? "border-slate-700" : "border-stone-300"} flex flex-col p-4`}>

        {/* PROFILE */}
        <ProfileCard
          onEdit={() => {
            setShowEdit(true)
            setShowAddFriend(false)
            setShowSetting(false)
            setSelectedUser(null)
          }}
        />

        {/* FRIEND LIST */}
        <div className={`flex-1 overflow-y-auto p-4 rounded-xl 
          ${darkMode ? "bg-slate-700 text-slate-200" : "bg-stone-100 text-gray-800"} m-4`}>

          <div className="flex items-center justify-between mb-2">
            <h2 className={`${darkMode ? "text-slate-100" : "text-gray-700"} text-sm font-semibold`}>
              Friends
            </h2>
          </div>

          <div className="space-y-2">
            <FriendList
              onChat={(friend, room) => {
                setShowEdit(false)
                setShowAddFriend(false)
                setShowSetting(false)
                setSelectedUser({ friend, room })
              }}
              onlineUsers={onlineUsers}
              contacts={contacts}
            />
          </div>
        </div>

        {/* ADD FRIEND */}
        <div className={`flex-none p-4 border-t rounded-xl 
          ${darkMode ? "bg-slate-700 border-slate-600 text-slate-200" : "bg-stone-100 border-stone-300 text-gray-800"} m-4`}>

          <div
            className={`cursor-pointer m-1 p-2 rounded-md ${darkMode ? "hover:bg-slate-600" : "hover:bg-stone-300"} relative`}
            onClick={() => {
              setShowAddFriend(true)
              setShowEdit(false)
              setShowSetting(false)
              setSelectedUser(null)
              clearRequests()
            }}
          >
            ➕ Add Friend

            {/* Badge */}
            {friendRequests > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {friendRequests}
              </span>
            )}
          </div>
        </div>

        {/* SETTINGS */}
        <div className={`flex-none p-4 border-t rounded-xl 
          ${darkMode ? "bg-slate-700 border-slate-600 text-slate-200" : "bg-stone-100 border-stone-300 text-gray-800"} m-4`}>

          <div
            className={`w-full text-left p-2 rounded-md ${darkMode ? "hover:bg-slate-600" : "hover:bg-stone-300"}`}
            onClick={() => {
              setShowAddFriend(false)
              setShowEdit(false)
              setShowSetting(true)
              setSelectedUser(null)
            }}
          >
            ⚙️ Setting
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 flex-col">
        {showEdit ? (
          <EditProfile onBack = {() => setShowEdit(false)}/>
        ) : showAddFriend ? (
          <AddFriendDashboard contacts={contacts} friendRequests={friendRequests} onBack = {() => setShowAddFriend(false)}/>
        ) : showSetting ? (
          <Setting setIsAuthenticated={setIsAuthenticated}/>
        ) : selectedUser ? (
          <ChatBox selectedUser={selectedUser} setContacts={setContacts} contacts={contacts} />
        ) : (
          <div
            className={`flex flex-1 items-center justify-center text-lg 
              ${darkMode ? "text-slate-400" : "text-gray-500"}`}
          >
            👋 Welcome! Select a friend from the left to start chatting.
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
