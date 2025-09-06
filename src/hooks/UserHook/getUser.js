import axios from 'axios'
import React from 'react'
import { useEffect,useState } from 'react'

function getUser(userId) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchUser = async () => {
        try {
            const user = await axios.post("http://localhost:9000/api/Users/getUserInfo",{userId:userId}).then(res => 
                {setUser(res.data.data)
            })

        } catch (error) {
            console.log("error in fetching User",error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(userId) {
            fetchUser()
        }
    },[userId])

  return {user, loading, refetch: fetchUser, setUser}
}

export default getUser