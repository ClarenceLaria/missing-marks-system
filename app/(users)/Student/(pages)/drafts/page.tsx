import React,{Suspense} from 'react'
import Search from '../../Components/Search'
import Card from '../../Components/Card'
import Table from '../../Components/Table'

const Loading = () => <div>Loading...</div>;
export default function page() {
  return (
    <div className='w-full h-full p-10'>
        <Suspense fallback={<Loading/>}>
          <Search placeholder='Search for a Reported Missing mark...'></Search>
        </Suspense>
        <Suspense fallback={<Loading/>}>
          <Table></Table>
        </Suspense>
    </div>
  )
}
