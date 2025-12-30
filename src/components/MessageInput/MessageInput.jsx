import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import socket from '../../socket'
import useContact from '../../hooks/FriendList/useContact'
import themeContext from '../../contexts/themeContext/themeContext'

function MessageInput({selectedRoom,user}) {

  console.log(selectedRoom)

  const {darkMode, setDarkMode} = useContext(themeContext)

    const [input,setInput] = useState("")

    const profile = JSON.parse(localStorage.getItem("getProfile"))
    console.log(profile)

    const handleIsTyping = async (roomId,profile) => {
      socket.emit("typing",{roomId,profile})
    }

    const handleIsStopTyping = async (roomId) => {
      socket.emit("stopTyping",{roomId})
    }

    const handleSend = async () => {

      if(!input.trim()) return

      console.log(selectedRoom,user,input)

      socket.emit("sendMessage",{
        roomId:selectedRoom?._id,
        senderId:profile?._id,
        content:input
      });

      setInput("")
    }
    
  return (
    <>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          className={`flex-1 ${darkMode ? "text-white":"text-gray-500"} border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
          onChange={(e) => {
            setInput(e.target.value)
            handleIsTyping(selectedRoom,profile)
            clearTimeout(window.typingTimeout)
            window.typingTimeout=setTimeout(() => {
              handleIsStopTyping(selectedRoom)
            },2000)
          }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
    </>
  )
}

export default MessageInput