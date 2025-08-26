import React from 'react'

function FriendCard({name,status,onClick}) {
  return (
    <div
    onClick={onClick}
    className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer'
    >
        <img src="mht"
        alt=""
        className='h-10 w-10 rounded-full bg-gray-300' />
        <div>
            <div className='font-medium text-gray-800'>{name}</div>
            <div className='text-xs text-gray-500'>{status}</div>
        </div>
    </div>
  )
}

export default FriendCard