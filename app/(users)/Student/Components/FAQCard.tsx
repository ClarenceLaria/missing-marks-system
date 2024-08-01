'use client'
import React, { useState } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx';

export default function FAQCard() {
  const [visible, setVisible] = useState(false);
  const toggleFAQS = () => {
    setVisible((prev) => !prev);
  }
  return (
    <>
        <div className='bg-gray-50 rounded-lg'>
          <div className='mx-5 py-5 border-b-2 '>
          <div className=' flex justify-between'>
            <h1 className='text-xl font-bold'>Is it possible to get physical help?</h1>
            <PlusIcon className={clsx(`w-6 h-6 cursor-pointer`, visible && 'hidden')} onClick={toggleFAQS}></PlusIcon>
            <MinusIcon className={clsx(`w-6 h-6 cursor-pointer`, !visible && 'hidden')} onClick={toggleFAQS}></MinusIcon>
          </div>
          <div className={clsx(``, !visible && 'hidden')}>
            <p className='font-bold opacity-50'>Yes of course, our offices are located at Science Complex on the first floor, Room 104.</p>
          </div>
          </div>
        </div>
    </>
  )
}
