import React from 'react'
import Table from '@/app/(users)/Lecturer/Components/Table'
import Search from '@/app/(users)/Student/Components/Search'

export default function page() {
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <h1 className='text-2xl font-bold'>Uncleared Missing Marks</h1>
            <Search placeholder='Search for a Reported Missing mark...'></Search>
            <Table></Table>
        </div>
    </div>
  )
}
