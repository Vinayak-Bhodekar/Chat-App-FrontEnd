import React, { useEffect, useState } from 'react'
import axios from 'axios'

function useProfile() {

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)


    const fetchProfile = async () => {
        try {
            const res = axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/Users/loggedUser`,{withCredentials:true}).then(res => {
                setProfile(res.data.data)
            })
        } catch (error) {
            console.log("error Fetching data",error)
            
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile();
    },[])


  return {profile, loading, refetch: fetchProfile, setProfile}
}

export default useProfile