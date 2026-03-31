import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../../socket.js";

import getUser from "../../hooks/UserHook/getUser.js";
import ChatDisplayBox from "./ChatDisplayBox.jsx";
import MessageInput from "../MessageInput/MessageInput.jsx";
import themeContext from "../../contexts/themeContext/themeContext.js";

import { decryptMessage } from "../../utils/e2ee.js";
import { getPrivateKey } from "../../utils/indexDB.js";
import { decryptAESKeyWithRSA, encryptAESKeyWithRSA } from "../../utils/aes.js";
import { importPrivateKey, importPublicKey } from "../../utils/rsa.js";
import unreadContext from "../../contexts/unreadMessageContext/unreadContext.js";
import { useNavigate } from "react-router-dom";

function ChatBox({ selectedUser, setContacts, contacts, onBack }) {
  const { user } = getUser(selectedUser?.friend);
  const profile = JSON.parse(localStorage.getItem("getProfile"));
  const { darkMode } = useContext(themeContext);

  const [messages, setMessages] = useState([]);
  const [userTyping, setUserTyping] = useState(null);
  const [showChatBar, setShowChatBar] = useState(false);
  const [selectMessages, setSelectMessages] = useState([]);

  const aesKeyRef = useRef(null);
  const { unread, setUnread } = useContext(unreadContext);

  /* 
      PREPARE ROOM AES KEY
   */
  useEffect(() => {
    if (!selectedUser?.room?._id) return;

    async function prepareRoomKey() {
      const roomId = selectedUser.room._id;

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/RoomKey/${roomId}/${profile._id}`,
        { withCredentials: true }
      );

      const encryptedAESKey = data?.data?.encryptedAESKey;

      if (!encryptedAESKey) return;

      const privateKeyPem = await getPrivateKey();

      const privateKey = await importPrivateKey(privateKeyPem);

      const decryptedAESKey = await decryptAESKeyWithRSA(
        encryptedAESKey, 
        privateKey
      );

      aesKeyRef.current = decryptedAESKey
    }

    prepareRoomKey();
  }, [selectedUser?.room?._id]);

  /* 
    MESSAGE SEEn
  */
  useEffect(() => {
    if (!selectedUser?.room?._id) return;

    socket.emit("message-seen", {
      roomId: selectedUser.room._id,
      userId: profile?._id
    });

    setUnread((prev) => ({
      ...prev,
      [selectedUser.room._id]: 0
    }));
  }, [selectedUser?.room?._id]);

  /* 
      FETCH OLD MESSAGES
     */
  useEffect(() => {
    if (!selectedUser?.room?._id) return;

    async function fetchMessages() {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Messages/getAllMessageByRoom`,
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
    MESSAGE SEEN
  */
  useEffect(() => {
    function onMessageRead({ roomId, seenBy }) {
      if (roomId !== selectedUser?.room?._id) return;

      setMessages((prev) =>
        prev.map((msg) => {
          // only update messages NOT sent by the user who saw them
          if (msg.sender !== seenBy) {
            return {
              ...msg,
              readBy: [...new Set([...(msg.readBy || []), seenBy])],
            };
          }
          return msg;
        })
      );
    }

    socket.on("message-read", onMessageRead);

    return () => {
      socket.off("message-read", onMessageRead);
    };
  }, [selectedUser?.room?._id]);

  useEffect(() => {
    if (!selectedUser?.room?._id || messages.length === 0) return;

    socket.emit("messages:seen", {
      roomId: selectedUser.room._id,
      userId: profile._id,
    });
  }, [selectedUser?.room?._id, messages.length]);

  useEffect(() => {
    socket.on("messagesDeleted", ({ messageIds }) => {
      
      setMessages(prev =>
        prev.filter(msg => !messageIds.includes(msg._id.toString()))
      );
    });

    return () => {
      socket.off("messagesDeleted");
    };
  }, []);

  /* 
      CHAT ACTIONS
  */
  const handleClearChat = async (roomId) => {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/Messages/deleteAllMessage`, {
      data: { roomId },
    });
    setMessages([]);
  };

  const handleDeleteContact = (roomId) => {
    socket.emit("deleteContact", { roomId });

    setContacts((prev) =>
      prev.filter((c) => c?.room?._id !== roomId)
    );

    onBack();
  };

  const handleDeleteSelected = () => {

    socket.emit("deleteMessage", { messageIds: selectMessages, roomId: "12" });

    setMessages((prev) =>
      prev.filter((msg) => !selectMessages.includes(msg._id))
    );

    setSelectMessages([]);
  };

  return (
    <div className="flex flex-1 flex-col h-full relative">
      {/* Header */}
      <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-700"} flex justify-between border-b border-amber-50`}>
        <div className="flex gap-3">
          <img className="h-10 w-10 rounded-full" src={selectedUser?.friend?.avatar || "https://cutiedp.com/wp-content/uploads/2025/08/no-dp-image-1.webp"} />
          <div>
            <div className={`${darkMode ? "text-amber-50" : "text-gray-700"}`}>{selectedUser?.friend?.name}</div>
            {userTyping && <div className={`text-sm ${darkMode ? "text-amber-50" : "text-gray-700"}`}>typing...</div>}
          </div>
        </div>
        <div className={`flex justify-between ${darkMode ? "text-white" : "text-black"}`}>
          {selectMessages.length > 0 && (
            <div >
              <button
                onClick={handleDeleteSelected}

              >
                Delete
              </button>
            </div>
          )}
          <div className={`${darkMode ? "hover:bg-slate-600" : "hover:bg-gray-500"} rounded-3xl px-0.5 py-0.5`} onClick={() => setShowChatBar(!showChatBar)}>⚙️</div>
        </div>
      </div>

      {showChatBar && (
        <div className={`absolute right-4 top-14 ${darkMode ? "bg-slate-600" : "bg-white"}  p-3 rounded border border-amber-50`}>
          <div className={`${darkMode ? "hover:bg-slate-500 text-white" : "hover:bg-gray-300 text-black"} rounded py-0.5 px-0.5`} onClick={() => handleClearChat(selectedUser.room._id)}>Clear Chat</div>
          <div className={`${darkMode ? "hover:bg-slate-500 text-white" : "hover:bg-gray-300 text-black"} rounded py-0.5 px-0.5`} onClick={() => handleDeleteContact(selectedUser.room._id)}>Delete Contact</div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-slate-700">
        <ChatDisplayBox selectMessages={selectMessages} setSelectMessages={setSelectMessages} messages={messages} profileId={profile?._id} friendId={selectedUser?.friend?.friend} />
      </div>

      <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
        <MessageInput selectedRoom={selectedUser?.room} user={user} setMessages={setMessages} messages={messages} />
      </div>
    </div>
  );
}

export default ChatBox;
