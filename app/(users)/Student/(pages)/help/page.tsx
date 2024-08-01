import React from 'react'
import FAQCard from '../../Components/FAQCard'
import Button from '@/app/Components/Button'
import clsx from 'clsx'

export default function page() {
  return (
    <div className='w-full h-full px-10 py-5'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-extrabold '>FREQUENTLY ASKED QUESTIONS</h1>
        <h1 className='font-bold opacity-55'>Do you need some help with something or do you have questions on some features?</h1>
      </div>
      <div className='w-3/5 bg-gray-50 mx-auto my-5 rounded-lg'>
        <FAQCard></FAQCard>
        <FAQCard></FAQCard>
        <FAQCard></FAQCard>
        <FAQCard></FAQCard>
        {/* <FAQCard></FAQCard> */}
      </div>
      <div className='flex flex-col items-center '>
        <h1 className='font-bold grid mb-5 text-lg'>Have any other questions?</h1>
        <button className='flex justify-center rounded-3xl px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600'>Chat with us here</button>
      </div>
    </div>
  )
}
