import React from 'react'
import Table from '@/app/(users)/Admin/Components/AddLec'
import Search from '@/app/(users)/Student/Components/Search'

export default function page() {
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <Search placeholder='Search for a User...'></Search>
            <Table></Table>
        </div>
    </div>
  )
}