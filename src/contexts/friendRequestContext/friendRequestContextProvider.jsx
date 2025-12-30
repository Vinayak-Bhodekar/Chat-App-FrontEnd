
import React,{useContext,useEffect,useState} from 'react'
import friendRequestContext from './friendRequestContext'
import axios from 'axios'
import profileContext from '../profileContext/profileContext'
import socket from '../../socket'


function FriendRequestContextProvider({children}) {
  const {profile,loading} = useContext(profileContext)
  const [friendRequests,setFriendRequests] = useState(0)

  useEffect(() => {
    if(loading || !profile?._id) return;

    if(!socket.connected) {
      socket.auth = {token:profile._id}
      socket.connect()
    }

    socket.on("incomming-request", (newRequest) => {
      setFriendRequests(prev => prev+1)
      console.log(newRequest)
    })

    return () => {
      socket.off("incomming-request")
    }
  },[profile,loading])

  const clearRequests = () => setFriendRequests(0)

  return (
    <friendRequestContext.Provider value={{friendRequests,setFriendRequests,clearRequests}}>
        {children}
    </friendRequestContext.Provider>
  )
}

export default FriendRequestContextProvider