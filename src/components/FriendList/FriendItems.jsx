import React, { useState } from 'react'
import FriendCard from './FriendCard'
import getUser from '../../hooks/UserHook/getUser'
import socket from '../../socket'
function FriendItems({friend,room,onChat}) {

  const {user,loading} = getUser(friend)

  if (loading) return <div className="text-gray-400">Loading...</div>

  const handleClick = (roomName,userName) => {
    onChat(friend,room)
    console.log("friend clicked")
    if(socket.connected) {
      console.log("socket connected")
      socket.emit("joinRoom",roomName,userName)
    } else {
      console.log("socket disconnected")
      socket.on("connect",() => {
        socket.emit("joinRoom",roomName,userName)
      })
    }
  }

  const profile = JSON.parse(localStorage.getItem("getProfile"))


  return (
    <FriendCard 
    name={user?.userName}
    status={user?.status}
    onClick={() => handleClick(room._id,profile.userName)}
    />
  )
}

export default FriendItems