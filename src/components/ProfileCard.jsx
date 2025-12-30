import React, { useContext } from "react"
import useProfile from "../hooks/UserHook/useProfile.js"
import themeContext from "../contexts/themeContext/themeContext.js"
import profileContext from "../contexts/profileContext/profileContext.js"

function ProfileCard({ onEdit}) {

  let {profile,loading} = useContext(profileContext)

  const {darkMode,setDarkMode} = useContext(themeContext)

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (!profile) return <div className="text-red-500">Failed to load profile</div>

  return (
    <div
      className={`p-4 border-b rounded-xl m-4 flex flex-col items-center 
        ${darkMode
          ? "bg-slate-700 border-slate-600 text-slate-100"
          : "bg-white border-stone-300 text-gray-900"
        }`}
    >

      {/* Profile Picture */}
      <img
        src={profile.url || profile.profile}
        alt="Profile"
        className="h-20 w-20 rounded-full object-cover bg-gray-300 shadow"
      />

      {/* Name */}
      <div className="mt-2 text-center">
        <div
          className={`font-semibold text-lg 
            ${darkMode ? "text-slate-100" : "text-gray-800"}`}
        >
          {profile.firstName + " " + profile.lastName}
        </div>

        {/* BIO */}
        <div
          className={`text-sm 
            ${darkMode ? "text-slate-400" : "text-gray-500"}`}
        >
          {profile.bio || "Hey there! I’m using the chat app 😊"}
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={onEdit}
        className={`mt-3 text-sm font-medium transition-all duration-150
          ${darkMode
            ? "text-indigo-400 hover:text-indigo-300"
            : "text-indigo-600 hover:text-indigo-500"
          }`}
      >
        Edit Profile
      </button>

    </div>
  )
}

export default ProfileCard
