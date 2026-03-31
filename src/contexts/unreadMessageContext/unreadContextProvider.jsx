import { useEffect, useState } from "react";
import unreadContext from "./unreadContext";
import axios from "axios";
import socket from "../../socket";

export default function UnreadContextProvider({ children }) {
  const [unread, setUnread] = useState({}); 
  // { roomId: count }

  // Fetch initial unread
  useEffect(() => {
    async function fetchUnread() {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/Messages/unread`,
        { withCredentials: true }
      );
      const map = {};
      res.data.data.forEach((r) => {
        map[r._id] = r.count;
      });

      setUnread(map);
    }

    fetchUnread();
  }, []);

  // SOCKET: new message
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("getProfile"));
    socket.on("newMessage", (message) => {
      const profile = JSON.parse(localStorage.getItem("getProfile"));
      

      if (message.sender !== profile._id) {
        setUnread((prev) => ({
          ...prev,
          [message.room]: (prev[message.room] || 0) + 1
        }));
      }
    });

    socket.on("newMessage-notification", (message) => {
      
      
      if (message?.sender !== profile?._id) {
        setUnread((prev) => ({
          ...prev,
          [message?.room]: (prev[message?.room] || 0) + 1
        }));
      }
      
    });

    socket.on("message-read", ({ roomId, seenBy }) => {
      const profile = JSON.parse(localStorage.getItem("getProfile"));
      if (seenBy === profile._id) {
        setUnread((prev) => ({ ...prev, [roomId]: 0 }));
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("newMessage-notification")
      socket.off("message-read");
    };
  }, []);

  return (
    <unreadContext.Provider value={{ unread, setUnread }}>
      {children}
    </unreadContext.Provider>
  );
}
