import React from 'react'
import Search from '../Components/Search'
import Card from '../Components/Card'

export default function page() {
  return (
    <div className='w-full h-full p-10'>
        <Search placeholder='Search for a Reported Missing mark...'></Search>
        <div className='mt-10 mb-2 w-full h-10 font-bold bg-gray-50 rounded flex flex-row justify-around items-center'>
                <h1 className='justify-start'>UnitName</h1>
                <h1>UnitCode</h1>
                <h1>Date Submitted</h1>
                <h1 className='px-4 hidden lg:block'>View Full Report</h1>
                <h1 className='px-4 hidden lg:block'>Status</h1>
        </div>
        <Card></Card>
        <Card></Card>
        <Card></Card>
    </div>
  )
}
