import React, { useContext } from 'react'
import FriendCard from './FriendCard'
import useProfile from '../../hooks/UserHook/useProfile.js'
import FriendItems from './FriendItems.jsx'
import socket from '../../socket.js'
import themeContext from '../../contexts/themeContext/themeContext.js'

function FriendList({ onChat, onlineUsers, contacts }) {

  const profile = JSON.parse(localStorage.getItem("getProfile"));

  const {darkMode,setDarkMode} = useContext(themeContext)

  

  if (!contacts) return <div className="text-red-500">Failed to load contacts</div>

  const handleClick = (userName, roomName) => {
    onChat(null, roomName)

    if (socket.connected) {
      socket.emit("joinRoom", roomName, userName)
    } else {
      socket.on("connect", () => {
        socket.emit("joinRoom", roomName, userName)
      })
    }
  }

  return (
    <div className={`flex-1 overflow-y-auto p-2 rounded-xl 
      ${darkMode ? "bg-slate-700 text-slate-200" : "bg-stone-100 text-gray-800"}`}>

      <div className="space-y-2">

        {contacts.map((contact) => {
          const isOnline = onlineUsers?.[contact?.friend] === "Online"
          if (contact?.isGroup) {
            
            return (
              <FriendCard
                key={contact?.friend}
                friend={contact?.friend}
                room={contact?.room}
                name={contact?.name}
                avatar={contact?.avatar || "group.png"}
                darkMode={darkMode}
                onClick={() => handleClick(profile?.userName, contact?.name)}
              />
            )
          } else {

            return (
              <FriendItems
                key={contact?.friend}
                friend={contact?.friend}
                room={contact?.room}
                name={contact?.name}
                avatar={contact?.avatar}
                onChat={onChat}
                darkMode={darkMode}
                isOnline={isOnline}
              />
            )
          }
        })}

      </div>
    </div>
  )
}

export default FriendList
