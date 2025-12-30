import React, { useEffect,useState } from 'react'
import axios from 'axios'
import socket from '../socket';

function FriendRequest() {
  const [requests, setRequests] = useState([])
  const profile = JSON.parse(localStorage.getItem("getProfile"));

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/Request/incomingRequests",{withCredentials:true})
        setRequests(res.data.data)
      } catch (error) {
        console.log("error fetching requests",error)
      }
    }
    fetchRequests();
  },[]);

  const handleAccept = async (res) => {
    try {
      socket.emit("acceptRequest",{userId:profile?._id,requestId:res._id})
      setRequests(requests.filter((req) => req._id !== res._id));
    } catch (error) {
      console.log("error in accepting request",error)
    }
  }
  const handleReject = async (id) => {
    try {
      await axios.post("http://localhost:9000/api/Request/rejectRequest",{requestId:id},{withCredentials:true})
      setRequests(requests.filter((req) => req._id !== id));
    } catch (error) {
      console.log("error in rejecting request",error)
    }
  }
  
  return (
    <div>
        <h2 className='text-xl font-semibold mb-4'>Incoming Friend Requests</h2>
        {requests.length > 0 ? (
            requests.map((req) => (
                <div
                key={req._id}
                className='flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-2'>
                  <div>
                    <div className='font-semibold'>{req.sender.userName}</div>
                    <div className='text-sm text-gray-500'>{req.sender.email}</div>
                  </div>
                  <div className='space-x-2'>
                    <button
                    onClick={() => handleAccept(req)}
                    className='bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600'>
                      Accept
                    </button>
                    <button
                    onClick={() => handleReject(req._id)}
                    className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600'>
                      Reject
                    </button>
                  </div>
                </div>
            ))
        ): (
          <div className='text-gray-500'>No incoming requests</div>
        )}
    </div>
  )
}

export default FriendRequest