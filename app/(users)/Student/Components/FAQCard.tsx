import React from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

export default function FAQCard() {
  return (
    <>
        <div className='mx-5 py-5 border-b-2'>
          <div className=' flex justify-between'>
            <h1 className='text-xl font-bold'>Is it possible to get physical help?</h1>
            <PlusIcon className='w-6 h-6'></PlusIcon>
          </div>
          <div>
            <p className='font-bold opacity-50'>Yes of course, our offices are located at Science Complex on the first floor, Room 104.</p>
          </div>
        </div>
    </>
  )
}
