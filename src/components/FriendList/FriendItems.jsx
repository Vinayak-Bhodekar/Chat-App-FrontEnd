import React, { useState } from 'react'
import FriendCard from './FriendCard'
import getUser from '../../hooks/UserHook/getUser'
import socket from '../../socket'
function FriendItems({friend,room,name,avatar,darkMode,onChat,isOnline}) {

  const handleClick = (roomName,userName) => {
    onChat({name,avatar},room)
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
    friend={friend}
    room={room}
    name={name}
    avatar={avatar}
    darkMode={darkMode}
    onClick={() => handleClick(room,profile.userName)}
    isOnline={isOnline}
    />
  )
}

export default FriendItems