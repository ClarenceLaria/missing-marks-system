import React from 'react'
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function Card() {
  return (
    <div className='py-5'>
        <div className='w-full h-14 bg-gray-50 rounded flex flex-row justify-around items-center'>
                <h1 className='justify-start truncate'>Introduction to Programming</h1>
                <h1>UnitCode</h1>
                <h1>22/05/2024</h1>
                <div className='bg-sky-300 rounded-full p-2 lg:rounded-md'>
                    <h1 className='px-4 hidden lg:block'>View</h1>
                    <EyeIcon className='sm:w-3 sm:h-3 md:h-4 md:w-4 lg:hidden '/>
                </div>
                <div className='bg-green-300 rounded-full p-2 lg:rounded-md'>
                    <h1 className='px-4 hidden lg:block'>Status</h1>
                    <TrashIcon className='sm:w-3 sm:h-3 md:h-4 md:w-4 lg:hidden'/>
                </div>
        </div>
    </div>
  )
}
