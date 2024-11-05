import React,{Suspense} from 'react'
import Table from '@/app/(users)/Admin/Components/Table'
import Search from '@/app/(users)/Student/Components/Search'

const Loading = () => <div>Loading...</div>;

export default function page() {
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <Suspense fallback={<Loading/>}>
                <Search placeholder='Search for a Pending Missing Mark...'></Search>
            </Suspense>
            <Suspense fallback={<Loading/>}>
                <Table></Table>
            </Suspense>
        </div>
    </div>
  )
}