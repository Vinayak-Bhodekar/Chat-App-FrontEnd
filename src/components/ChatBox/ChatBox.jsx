import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../../socket.js";

import getUser from "../../hooks/UserHook/getUser.js";
import ChatDisplayBox from "./ChatDisplayBox.jsx";
import MessageInput from "../MessageInput/MessageInput.jsx";
import themeContext from "../../contexts/themeContext/themeContext.js";

import { decryptMessage } from "../../utils/e2ee.js";
import { getPrivateKey } from "../../utils/indexDB.js";
import { decryptAESKeyWithRSA } from "../../utils/aes.js";
import { importPrivateKey } from "../../utils/rsa.js";

function ChatBox({ selectedUser, setContacts }) {
  const { user } = getUser(selectedUser?.friend);
  const profile = JSON.parse(localStorage.getItem("getProfile"));
  const { darkMode } = useContext(themeContext);

  const [messages, setMessages] = useState([]);
  const [userTyping, setUserTyping] = useState(null);
  const [showChatBar, setShowChatBar] = useState(false);

  
  const aesKeyRef = useRef(null);

  /* 
      PREPARE ROOM AES KEY
   */
  useEffect(() => {
    if (!selectedUser?.room?._id) return;

    async function prepareRoomKey() {
      const roomId = selectedUser.room._id;

      const { data } = await axios.get(
        `http://localhost:9000/api/RoomKey/${roomId}/${profile._id}`,
        { withCredentials: true }
      );

      const encryptedAESKey = data?.data?.encryptedAESKey;
      if (!encryptedAESKey) return;

      const privateKeyPem = await getPrivateKey();
      const privateKey = await importPrivateKey(privateKeyPem);

      aesKeyRef.current = await decryptAESKeyWithRSA(
        encryptedAESKey,
        privateKey
      );
    }

    prepareRoomKey();
  }, [selectedUser?.room?._id]);

  /* 
      FETCH OLD MESSAGES
     */
  useEffect(() => {
    if (!selectedUser?.room?._id) return;

    async function fetchMessages() {
      const res = await axios.post(
        "http://localhost:9000/api/Messages/getAllMessageByRoom",
        { roomId: selectedUser.room._id },
        { withCredentials: true }
      );

      const decrypted = await Promise.all(
        res.data.data.map(async (msg) => {
          if (!msg.content?.cipherText) return msg;

          const text = await decryptMessage(
            aesKeyRef.current,
            msg.content.cipherText,
            msg.content.iv
          );

          return { ...msg, content: text };
        })
      );

      setMessages(decrypted);
    }

    fetchMessages();
  }, [selectedUser?.room?._id]);

  /*
      SOCKET: NEW MESSAGE
      */
  useEffect(() => {
    async function onMessage(msg) {
      if (!msg.content?.cipherText) {
        setMessages((prev) => [...prev, msg]);
        return;
      }

      const text = await decryptMessage(
        aesKeyRef.current,
        msg.content.cipherText,
        msg.content.iv
      );

      setMessages((prev) => [...prev, { ...msg, content: text }]);
    }

    socket.on("newMessage", onMessage);
    return () => socket.off("newMessage", onMessage);
  }, []);

  /* 
      TYPING INDICATOR
    */
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("user:typing", ({ userId }) => {
      if (userId !== profile._id) setUserTyping(userId);
    });

    socket.on("user:stopTyping", ({ userId }) => {
      if (userId !== profile._id) setUserTyping(null);
    });

    return () => {
      socket.off("user:typing");
      socket.off("user:stopTyping");
    };
  }, []);

  /* 
      CHAT ACTIONS
   */
  const handleClearChat = async (roomId) => {
    await axios.delete("http://localhost:9000/api/Messages/deleteAllMessage", {
      data: { roomId },
    });
    setMessages([]);
  };

  const handleDeleteContact = async (roomId) => {
    await axios.delete(
      "http://localhost:9000/api/Rooms/deleteRoom",
      { data: { roomId } },
      { withCredentials: true }
    );

    setContacts((prev) => prev.filter((c) => c._id !== roomId));
  };

  
     
  return (
    <div className="flex flex-1 flex-col h-full relative">
      {/* Header */}
      <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-700"} flex justify-between`}>
        <div className="flex gap-3">
          <img className="h-10 w-10 rounded-full" src={selectedUser?.friend?.avatar} />
          <div>
            <div className={`${darkMode ? "text-amber-50" : "text-gray-700"}`}>{selectedUser?.friend?.name}</div>
            {userTyping && <div className={`text-sm ${darkMode ? "text-amber-50" : "text-gray-700"}`}>typing...</div>}
          </div>
        </div>
        <div onClick={() => setShowChatBar(!showChatBar)}>⚙️</div>
      </div>

      {showChatBar && (
        <div className="absolute right-4 top-14 bg-white p-3 rounded">
          <div onClick={() => handleClearChat(selectedUser.room._id)}>Clear Chat</div>
          <div onClick={() => handleDeleteContact(selectedUser.room._id)}>Delete Contact</div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-slate-700">
        <ChatDisplayBox messages={messages} />
      </div>

      <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
        <MessageInput selectedRoom={selectedUser?.room} user={user} />
      </div>
    </div>
  );
}

export default ChatBox;
