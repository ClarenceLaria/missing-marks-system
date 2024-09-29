import React,{Suspense} from 'react'
import Table from '@/app/(users)/Lecturer/Components/Table'
import Search from '@/app/(users)/Student/Components/Search'

const Loading = () => <div>Loading...</div>;
export default function page() {
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <h1 className='text-2xl font-bold'>Cleared Missing Marks</h1>
            <Suspense fallback={<Loading/>}>
              <Search placeholder='Search for a Cleared Missing mark...'></Search>
            </Suspense>
            <Suspense fallback={<Loading/>}>
              <Table></Table>
            </Suspense>
        </div>
    </div>
  )
}
