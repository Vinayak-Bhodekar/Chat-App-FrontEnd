import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import socket from '../../socket'
import useContact from '../../hooks/FriendList/useContact'
import themeContext from '../../contexts/themeContext/themeContext'
import { encryptMessage } from '../../utils/e2ee.js'
import { decryptAESKeyWithRSA } from '../../utils/aes.js'
import { getPrivateKey } from '../../utils/indexDB.js'
import { importPrivateKey } from '../../utils/rsa.js'
//import { getRoomKey } from '../../hooks/Encryption/useEncryption.js'
//import { encryptMessage } from '../../utils/e2ee'

function MessageInput({selectedRoom,user}) {

  const {darkMode, setDarkMode} = useContext(themeContext)

    const [input,setInput] = useState("")

    const profile = JSON.parse(localStorage.getItem("getProfile"))

    const handleIsTyping = async (roomId,profile) => {
      socket.emit("typing",{roomId,profile})
    }

    const handleIsStopTyping = async (roomId) => {
      socket.emit("stopTyping",{roomId})
    }

    const handleSend = async () => {

      if(!input.trim()) return

      const res = await axios.get(`http://localhost:9000/api/RoomKey/${selectedRoom?._id}/${profile?._id}`)
      const key = res.data.data
      const privateRSAKey = await getPrivateKey()  // encrypted private key
      const importedRSAKey = await importPrivateKey(privateRSAKey) // decrypted private Key
      const decryptedAESKey = await decryptAESKeyWithRSA(key?.encryptedAESKey,importedRSAKey) // decrypted aes key
      const encrypted = await encryptMessage(decryptedAESKey,input);
      socket.emit("sendMessage",{
        roomId:selectedRoom?._id,
        senderId:profile?._id,
        content:{cipherText:encrypted?.cipherText,iv:encrypted?.iv}
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