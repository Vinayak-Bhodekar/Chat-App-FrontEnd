import React, { useState } from 'react'
import FriendCard from './FriendCard'
import getUser from '../../hooks/UserHook/getUser'
import socket from '../../socket'
function FriendItems({friend,room,name,avatar,darkMode,onChat,isOnline,unseenCount}) {


  const handleClick = (roomName,userName) => {
    onChat({name,avatar,friend},room)
    if(socket.connected) {
      
      socket.emit("joinRoom",roomName,userName)
    } else {
      
      socket.on("connect",() => {
        socket.emit("joinRoom",roomName,userName)
      })
    }
  }

  const profile = JSON.parse(localStorage.getItem("getProfile"))


  return (
    <FriendCard 
    friend={friend}
    room={room}
    name={name}
    avatar={avatar}
    darkMode={darkMode}
    onClick={() => handleClick(room,profile.userName)}
    isOnline={isOnline}
    roomId = {room?._id}
    unseenCount={unseenCount}
    />
  )
}

export default FriendItems