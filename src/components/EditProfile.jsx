import React, {useEffect, useState} from 'react'
import useProfile from '../hooks/useProfile'
import axios from 'axios'

function EditProfile() {

  const {profile} = useProfile()

  const [userName, setUserName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("Thsi is the user Bio ...")


  useEffect(() => {
    
    if(profile) {
      
      setUserName(profile.userName || "")
      setFirstName(profile.firstName || "")
      setLastName(profile.lastName || "")
      setEmail(profile.email || "")
      //setBio(profile.bio || "")
    }
  },[profile])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const updatedInfo = {userName:userName, firstName:firstName, lastName:lastName, email:email, bio:bio}

      console.log(updatedInfo)

      const res = await axios.post("http://localhost:9000/api/Users/editProfile",updatedInfo,{withCredentials:true})
    } catch (error) {
      console.log("failed to update user Profile",error)
    }
  }

  return (
    <div className='p-6'>
      <h2
      className='text-xl font-semibold mb-4'
      >Edit Profile</h2>

      <form 
      className='space-y-4 max-w-md'
      onSubmit={handleSubmit}>

        {/*Profile Picture */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Profile Picture</label>
          <input type="file" className='w-full border rounded-lg p-2' />
        </div>

        {/*First Name */}
        <div>
          <label className='block text-sm font medium text-gray-700 mb-1'>First Name</label>
          <input type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className='w-full border rounded-lg p-2 focus:ring-blue-400 focus: outline-none'/>
        </div>

        {/*Last NAme */}
        <div>
          <label className='block text-sm font medium text-gray-700 mb-1'>Last Name</label>
          <input type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className='w-full border rounded-lg p-2 focus:ring-blue-400 focus: outline-none'/>
        </div>

        {/*user NAme */}
        <div>
          <label className='block text-sm font medium text-gray-700 mb-1'>User Name</label>
          <input type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className='w-full border rounded-lg p-2 focus:ring-blue-400 focus: outline-none'/>
        </div>

        {/*email */}
        <div>
          <label className='block text-sm font medium text-gray-700 mb-1'>Email</label>
          <input type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border rounded-lg p-2 focus:ring-blue-400 focus: outline-none'/>
        </div>

        {/*Bio */}
        <div>
          <label className='block text-sm font medium text-gray-700 mb-1'>Bio</label>
          <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className='w-full border rounded-lg p-2 focus:ring-blue-400 focus: outline-none'
          rows="3"/>
        </div>

        <button 
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>Save changes</button>
      </form>
    </div>
  )
}

export default EditProfile