import { useEffect, useState } from "react";
import getUser from "../../hooks/UserHook/getUser.js";
import ChatDisplayBox from "./ChatDisplayBox.jsx";
import MessageInput from "../MessageInput/MessageInput.jsx";
import socket from "../../socket.js";
import axios from "axios";

function ChatBox({ selectedUser }) {
  const { user } = getUser(selectedUser?.friend);

  const [messages, setMessages] = useState([]);
  const [userTyping, setUserTyping] = useState(null);

  console.log(selectedUser)

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
    if (!socket.connected) socket.connect();

    socket.on("user:typing", ({ userId }) => setUserTyping(userId));
    socket.on("user:stopTyping", () => setUserTyping(null));

    return () => {
      socket.off("user:typing");
      socket.off("user:stopTyping");
    };
  }, [selectedUser?.room?._id]);

  useEffect(() => {
    if (!selectedUser?.room) return;

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedUser?.room, user?._id]);

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-300 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={selectedUser?.avatar || "https://via.placeholder.com/40"}
            alt=""
            className="h-10 w-10 rounded-full bg-gray-300"
          />
          <div>
            <div className="font-semibold">{user?.userName || "Name"}</div>
            {userTyping && userTyping !== user?._id && (
              <div className="text-gray-600 text-sm">
                {selectedUser?.friend || "User"} is typing...
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          <div>🔔</div>
          <div>⚙️</div>
        </div>
      </div>

      {/* Messages Area (scrollable) */}
      <div className="flex-1 bg-gray-200 overflow-y-auto">
        <ChatDisplayBox messages={messages} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-300 flex items-center space-x-3">
        <MessageInput selectedRoom={selectedUser?.room} user={user} />
      </div>
    </div>
  );
}

export default ChatBox;
