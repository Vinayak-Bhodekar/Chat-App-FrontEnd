import { useState,useEffect } from 'react'
import ProfileCard from '../components/ProfileCard'
import EditProfile from '../components/EditProfile'
import FriendList from '../components/FriendList/FriendList'
import AddFriendDashboard from '../components/AddFriendDashboard'
import Setting from '../components/Setting'
import ChatBox from '../components/ChatBox/ChatBox.jsx'
import useProfile from '../hooks/UserHook/useProfile.js'
import socket from '../socket.js'



function Dashboard() {


  useEffect(() => {
    if(!socket.connected) {
      socket.connect()
    }

    const profile = JSON.parse(localStorage.getItem("getProfile"))
    socket.auth = {token: profile?._id}

    socket.on("connect", () => [
      console.log("socket connected: ",socket.id)
    ])

    socket.on("disconnect", () => [
      console.log("socket disconnected")
    ])

    return () => {
      socket.off("connect")
      socket.off("disconnect")
    }

  },[])

  

    const [showEdit, setShowEdit] = useState(false)
    const [showAddFriend, setShowAddFriend] = useState(false)
    const [showSetting, setShowSetting] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className='flex h-screen bg-gray-600'>

      {/*Sidebar*/}
      <div className='w-1/4 bg-gray-300 border-r border-gray-900 flex flex-col p-4'>

        {/*Profile Section*/}
        <ProfileCard onEdit={() => {
          setShowEdit(true)
          setShowAddFriend(false)
          setShowSetting(false)
          setSelectedUser(null)}}/>

        {/*Chats & groups */}
        <div className='flex-1 overflow-y-auto p-4 rounded-xl bg-white m-4'>
          <h2 className='text-gray-600 text-sm font-semibold mb-2'>chats & groups</h2>
          <div className='space-y-2'>
            <FriendList onChat={(friend,room) => {
              setShowEdit(false)
              setShowAddFriend(false)
              setShowSetting(false)
              setSelectedUser({friend,room})
            }}/>
          </div>
        </div>
        

        {/*Saved and others */}
        <div className='flex-none p-4 border-t border-gray-200 rounded-xl bg-white m-4'>
          <div
          className='cursor-pointer m-1 p-1 rounded-md hover:bg-gray-100'
          onClick={() => {
            setShowAddFriend(true)
            setShowEdit(false)
            setShowSetting(false)
            setSelectedUser(null)
          }}
          >Add friend</div>
        </div>

        {/*Setting */}
        <div className='flex-none p-4 border-t border-gray-200 rounded-xl bg-white m-4'>
          <div className='w-full text-left p-2 rounded-md hover:bg-gray-100'
          onClick={() => {
            setShowAddFriend(false)
            setShowEdit(false)
            setShowSetting(true)
            setSelectedUser(null)
          }}>setting</div>
        </div>
      </div>

      {/*Main*/}
    <div className='flex flex-1 flex-col'>
      {showEdit ? (
        <EditProfile />
      ) : showAddFriend ? (
        <AddFriendDashboard />
      ) : showSetting ? (
        <Setting />
      ) : selectedUser ? (
        <ChatBox selectedUser={selectedUser} />
      ) : (
        // 👇 Fallback UI when no chat is selected
        <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
          👋 Welcome! Select a friend from the left to start chatting.
        </div>
      )}
    </div>
    </div>
  )
}

export default Dashboard