import React from 'react'

export default function page() {
  return (
    <div className='w-full h-full'>
        <div>
            <h1 className='text-2xl font-bold pt-10 px-10 text-center'>Missing Marks Report</h1>
            <div className='w-full py-5 flex flex-row justify-evenly'>
                <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
                <h1>Total Missing Marks</h1>
                <h1>3</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Pending Missing Marks</h1>
                    <h1>3</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Missing Marks Found</h1>
                    <h1>3</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Missing Marks Not Found</h1>
                    <h1>3</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Forwarded Missing Marks</h1>
                    <h1>3</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Cleared Missing Marks</h1>
                    <h1>3</h1>
                </div>
            </div>
        </div>
        <div>
            <h1 className='text-2xl font-bold pt-10 px-10 text-center'>Users</h1>
            <div className='w-full py-5 flex flex-row justify-evenly'>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Total Users</h1>
                    <h1>3</h1>
                </div>
                <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
                <h1>Total Students</h1>
                <h1>3</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Total Lecturers</h1>
                    <h1>3</h1>
                </div>
            </div>
        </div>
    </div>
  )
}
