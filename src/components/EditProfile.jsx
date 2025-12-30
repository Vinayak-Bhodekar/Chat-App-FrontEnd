import React, { useContext, useEffect, useState } from 'react'
import useProfile from '../hooks/UserHook/useProfile'
import axios from 'axios'
import themeContext from '../contexts/themeContext/themeContext'
import profileContext from '../contexts/profileContext/profileContext'

function EditProfile({onBack}) {

  const { darkMode } = useContext(themeContext)
  const {Profile,setProfile} = useContext(profileContext)
  const { profile } = useProfile()

  const [userName, setUserName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [userBio, setBio] = useState("")
  const [file, setFile] = useState(null)

// for displaying on changes fields
  useEffect(() => {
    if(profile) {
      setUserName(profile.userName || "")
      setFirstName(profile.firstName || "")
      setLastName(profile.lastName || "")
      setEmail(profile.email || "")
      setBio(profile.bio || "")
    }
  }, [profile])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ update text info
      const updatedInfo = {
        userName,
        firstName,
        lastName,
        email,
        bio: userBio,
      };

      const profileRes = await axios.post(
        "http://localhost:9000/api/Users/editProfile",
        updatedInfo,
        { withCredentials: true }
      );
      
      let imageRes = null

      // 2️⃣ upload image if selected
      if (file) {
        const formData = new FormData();
        formData.append("profile", file);

        imageRes = await axios.post(
          "http://localhost:9000/api/Users/userProfile",
          formData,
          { withCredentials: true }
        );
      }
      console.log("image-",imageRes)
      console.log("profile-",profileRes)

      const updatedProfile = {
        ...profileRes?.data?.data,
        ...(imageRes?.data?.data || {})
      }

      setProfile(updatedProfile);
      localStorage.setItem(
        "getProfile",
        JSON.stringify(updatedProfile)
      );

      console.log("Profile updated successfully");
    } catch (error) {
      console.log("Failed to update user profile:", error);
    }
  };


  return (
    <div className='p-6'>

      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-4">

        {/* Back Button */}
        <button
          onClick={onBack}
          className={`px-3 py-1 rounded-lg text-sm ${
            darkMode
              ? "text-white border-white hover:bg-gray-700"
              : "text-black border-black hover:bg-gray-200"
          }`}
        >
          ⬅ Back
        </button>

        {/* Title */}
        <h2
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Edit Profile
        </h2>
        <div></div>
        <div></div>
        <div></div>
      </div>


      {/* FORM */}
      <form className='space-y-4 max-w-md' onSubmit={handleSubmit}>

        {/* Profile Picture */}
        <div>
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-black"} mb-1`}>
            Profile Picture
          </label>
          <input
            type="file"
            className={`w-full border rounded-lg p-2 ${
              darkMode ? "border-white text-white" : "border-black text-black"
            }`}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* First Name */}
        <div>
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-black"} mb-1`}>
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full border rounded-lg p-2 ${
              darkMode ? "border-white text-white" : "border-black text-black"
            }`}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-black"} mb-1`}>
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full border rounded-lg p-2 ${
              darkMode ? "border-white text-white" : "border-black text-black"
            }`}
          />
        </div>

        {/* Username */}
        <div>
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-black"} mb-1`}>
            User Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={`w-full border rounded-lg p-2 ${
              darkMode ? "border-white text-white" : "border-black text-black"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-black"} mb-1`}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-lg p-2 ${
              darkMode ? "border-white text-white" : "border-black text-black"
            }`}
          />
        </div>

        {/* Bio */}
        <div>
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-black"} mb-1`}>
            Bio
          </label>
          <textarea
            value={userBio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
            className={`w-full border rounded-lg p-2 ${
              darkMode ? "border-white text-white" : "border-black text-black"
            }`}
          />
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
        >
          Save Changes
        </button>

      </form>
    </div>
  )
}

export default EditProfile
