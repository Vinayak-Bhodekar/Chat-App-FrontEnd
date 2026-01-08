import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

function useContact() {

    const [contacts, setContacts] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchContact = async () => {
        try {
            const friend = await axios.get("http://localhost:9000/api/Rooms/getMyRooms",{withCredentials:true}).then(res => {
                setContacts(res.data.data)
            })
        } catch (error) {
            console.log("error in fetching contacts",error)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContact()
    },[])

  return {contacts, loading, refetch: fetchContact, setContacts}
}

export default useContact