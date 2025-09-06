import React from "react"
import axios from 'axios'
import useProfile from "../hooks/UserHook/useProfile.js"

function ProfileCard({onEdit}) {

  const {profile, loading} = useProfile()

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (!profile) return <div className="text-red-500">Failed to load profile</div>;

  return (
    <div className="p-4 border-b border-gray-300 flex flex-col items-center bg-white rounded-xl m-4">
      {/* Profile Picture */}
      <img
        src="https://via.placeholder.com/80"
        alt="Profile"
        className="h-20 w-20 rounded-full bg-gray-200"
      />

      {/* Name & Bio */}
      <div className="mt-2 text-center">
        <div className="font-semibold text-lg">{profile.firstName + " " + profile.lastName}</div>
        <div className="text-sm text-gray-500">This is the user bio...</div>
      </div>

      {/* Edit Profile Button */}
      <button onClick={onEdit}
      className="mt-2 text-blue-500 text-sm hover:underline">
        Edit Profile
      </button>
    </div>
  )
}

export default ProfileCard
