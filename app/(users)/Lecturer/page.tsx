import React from 'react'

export default function page() {
  return (
    <div className='w-full h-full'>
        <div className='w-full py-5 flex flex-row justify-evenly'>
            <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
            <h1>Uncleared Missing Marks</h1>
            <h1>3</h1>
            </div>
            <div className='w-44 h-44 rounded-lg shadow-lg flex flex-col justify-center items-center'>
                <h1>Cleared Marks</h1>
                <h1>3</h1>
            </div>
            <div className='w-44 h-44 rounded-lg shadow-lg flex flex-col justify-center items-center'>
                <h1>Forwarded</h1>
                <h1>3</h1>
            </div>
        </div>
    </div>
  )
}
