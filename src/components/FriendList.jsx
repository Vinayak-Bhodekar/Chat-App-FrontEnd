import React from 'react'
import FriendCard from './FriendCard'

function FriendList({friends}) {
  
  return (
    <div className='flex-1 overflow-y-auto p-4 rounded-xl bg-white m-4'>
        <h2 className='text-gray-600 text-sm font-semibold mb-3'>Friends</h2>
        <div className='space-y-2'>
            {
                friends.map((friend,idx) => (
                    <FriendCard 
                    key={idx}
                    name={friend.name}
                    status={friend.status}
                    onClick={() => console.log("Open Chat with",friend.name)}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default FriendList