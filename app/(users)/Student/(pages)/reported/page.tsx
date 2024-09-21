import React from 'react'
import Search from '../../Components/Search'
import Card from '../../Components/Card'
import Table from '../../Components/Table'

export default function page() {
  return (
    <div className='w-full h-full p-10'>
        <Search placeholder='Search for a Reported Missing mark...'></Search>
       
        <Table></Table>
       
    </div>
  )
}
