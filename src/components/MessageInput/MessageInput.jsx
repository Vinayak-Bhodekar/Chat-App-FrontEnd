import axios from 'axios'
import React, { useState, useEffect } from 'react'
import socket from '../../socket'

function MessageInput({selectedRoom,user}) {

    const [input,setInput] = useState("")

    const profile = JSON.parse(localStorage.getItem("getProfile"))
    

    /*const handleChange = (e) => {
      setInput(e.target.value)

      if(e.target.value.length > 0) {
        onTyping?.()
      } else {
        onStopTyping?.()
      }
    }*/

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
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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