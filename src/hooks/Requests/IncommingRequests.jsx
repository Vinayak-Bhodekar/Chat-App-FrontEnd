import axios from 'axios';
import React, { useEffect, useState } from 'react'

function IncommingRequests() {

    const [requests, setRequests] = useState();

    const fetchRequests = async () => {
        try {
            const request = await axios.get("http://localhost:9000/api/Request/getAllRequest",{withCredentials:true}).then(res => {
                setRequests(res.data.data);
                
            })

        } catch (error) {
            console.log("erroe in fetching incomming requests",error)
        }
    }

    useEffect(() => {
        fetchRequests();
    },[])
  return {requests};
}

export default IncommingRequests