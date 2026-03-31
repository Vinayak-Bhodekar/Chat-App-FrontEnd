import React, { useContext } from "react";
import themeContext from "../../contexts/themeContext/themeContext";
import unreadContext from "../../contexts/unreadMessageContext/unreadContext";

function FriendCard({ name, avatar, onClick, isOnline, roomId }) {
  const { darkMode } = useContext(themeContext);
  const { unread } = useContext(unreadContext);

  const unreadCount = unread[roomId] || 0;
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center space-x-3 p-2 rounded-lg cursor-pointer
      ${darkMode ? "hover:bg-slate-600" : "hover:bg-stone-300"}`}
    >
      <img
        src={avatar || "https://cutiedp.com/wp-content/uploads/2025/08/no-dp-image-1.webp"}
        className="h-10 w-10 rounded-full object-cover"
      />

      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-gray-400">
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>

      {unreadCount > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
}

export default FriendCard;
