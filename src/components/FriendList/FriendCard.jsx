import React, { useContext } from 'react'
import themeContext from '../../contexts/themeContext/themeContext'

function FriendCard({ name, avatar, onClick, isOnline }) {
  const { darkMode } = useContext(themeContext)

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer
        transition-all duration-150 border 
        ${darkMode ? "hover:bg-slate-600" : "hover:bg-stone-300"}`}
    >
      <div className="relative">
        <img
          src={avatar}
          alt="avatar"
          className="h-10 w-10 rounded-full bg-gray-300 object-cover"
        />

        {/* Status dot */}
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2
            ${isOnline ? "bg-green-400 border-slate-800" : "bg-gray-400 border-slate-800"}`}
        />
      </div>

      <div>
        <div className={`${darkMode ? "text-slate-100" : "text-gray-800"} font-medium`}>
          {name}
        </div>

        <div className="text-xs text-gray-400">
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  )
}

export default FriendCard
