import { useContext, useEffect, useState } from "react";
import getUser from "../../hooks/UserHook/getUser.js";
import ChatDisplayBox from "./ChatDisplayBox.jsx";
import MessageInput from "../MessageInput/MessageInput.jsx";
import socket from "../../socket.js";
import axios from "axios";
import themeContext from "../../contexts/themeContext/themeContext.js";

function ChatBox({ selectedUser, setContacts, contacts}) {
  const { user } = getUser(selectedUser?.friend);
  const profile = JSON.parse(localStorage.getItem("getProfile"));

  const [messages, setMessages] = useState([]);
  const [userTyping, setUserTyping] = useState(null);
  const [showChatBar, setShowChatBar] = useState(false); 
  const {darkMode, setDarkMode} = useContext(themeContext)

  useEffect(() => {
    if (!selectedUser?.room) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.post(
          "http://localhost:9000/api/Messages/getAllMessageByRoom",
          { roomId: selectedUser.room?._id },
          { withCredentials: true }
        );
        setMessages(res.data.data);
      } catch (error) {
        console.log("error in fetching data", error);
      }
    };
    fetchMessages();
  }, [selectedUser?.room]);

  useEffect(() => {
    if (!user?._id) return;
    if (!socket.connected) socket.connect();

    const handleTyping = (userId) => {
      if (userId !== profile?._id) {
        setUserTyping(userId);
      }
    };

    const handleStopTyping = (userId) => {
      if (userId !== profile?._id) {
        setUserTyping(null);
      }
    };

    socket.on("user:typing", ({ userId }) => handleTyping(userId));
    socket.on("user:stopTyping", ({ userId }) => handleStopTyping(userId));

    return () => {
      socket.off("user:typing", handleTyping);
      socket.off("user:stopTyping", handleStopTyping);
    };
  }, [user?._id]);

  useEffect(() => {
    if (!selectedUser?.room) return;

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedUser?.room, user?._id]);

  const handleClearChat = async (roomId) => {
    try {
      const res = await axios.delete("http://localhost:9000/api/Messages/deleteAllMessage",{data:{roomId}})
      setMessages([])
    } catch (error) {
      console.log("error in delete messaage",error)
    }
  }

  const handleDeleteContact = async (roomId) => {
    try {
      const res = await axios.delete("http://localhost:9000/api/Rooms/deleteRoom",{data:{roomId}},{withCredentials:true})
      setContacts((contacts) => contacts.filter(contact => contact._id !== roomId))
    } catch (error) {
      console.log("error in deleting contact",error)
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full relative ">
      {/* Header */}
      <div className={`p-4 ${darkMode ? "bg-gray-800":"bg-gray-700"} border-b border-gray-300 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <img
            src={selectedUser?.avatar || "https://via.placeholder.com/40"}
            alt=""
            className="h-10 w-10 rounded-full bg-gray-300"
          />
          <div>
            <div className="font-semibold">{user?.userName || "Name"}</div>
            {userTyping && userTyping !== profile?._id && (
              <div className="text-gray-600 text-sm">is typing...</div>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          <div>🔔</div>
          <div
            className="cursor-pointer"
            onClick={() => setShowChatBar((prev) => !prev)} 
          >
            ⚙️
          </div>
        </div>
      </div>

      {/*Small Bar*/}
      {showChatBar && (
        <div className="absolute top-14 right-4 bg-white shadow-md border border-gray-300 rounded-lg p-3 w-48 z-10">
          <div className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => handleClearChat(selectedUser?.room?._id)}>
            Clear Chat
          </div>
          <div className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => handleDeleteContact(selectedUser.room?._id)}>
            Delete Contact
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 bg-slate-700 overflow-y-auto">
        <ChatDisplayBox messages={messages} />
      </div>

      {/* Input */}
      <div className={`p-4 ${darkMode ? "bg-gray-800":"bg-gray-200"} border-t border-gray-300 flex items-center space-x-3`}>
        <MessageInput selectedRoom={selectedUser?.room} user={user} />
      </div>
    </div>
  );
}

export default ChatBox;
