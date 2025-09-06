import React from 'react'
import FriendCard from './FriendCard'
import useContact from '../../hooks/FriendList/useContact'
import useProfile from '../../hooks/UserHook/useProfile.js'
import getUser from '../../hooks/UserHook/getUser.js'
import FriendItems from './FriendItems.jsx'
import socket from '../../socket.js'

function FriendList({onChat}) {

  const {contacts,loading} = useContact()
  const {profile} = useProfile()
  

  //if (loading) return <div className="text-gray-500">Loading...</div>;
  if (!contacts) return <div className="text-red-500">Failed to load contacts</div>;

  const handleClick = (userName,roomName) => {
    onChat(null,room)
    if(socket.connected) {
      socket.emit("joinRoom",roomName,userName)
    } else {
      socket.on("connect", () => {
        socket.emit("joinRoom",roomName,userName)
      })
    }
  }
  
  return (
    <div className='flex-1 overflow-y-auto p-4 rounded-xl bg-white m-4'>
        <h2 className='text-gray-600 text-sm font-semibold mb-3'>Friends</h2>
        <div className='space-y-2'>
            {
                contacts.map((room,idx) => {

                  if(room.isGroupChat) {
                    return (
                      <FriendCard 
                        key={idx}
                        name={room.roomName}
                        status={`${room.members.length} members`}
                        avatar={room.groupAvatar || "group.png"}
                        onClick={() => handleClick(profile?.userName,room?.roomName)}
                      />
                    )
                  } else {
                    const friend = room.members.find(member => member !== profile?._id)
                    return (
                      <FriendItems 
                        key={idx}
                        friend={friend}
                        room={room}
                        onChat={onChat}
                      />
                    )
                  }
              })
            }
        </div>
    </div>
  )
}

export default FriendList