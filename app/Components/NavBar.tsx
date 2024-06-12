'use client'
import React from 'react'
import Image from 'next/image'
import dp from '@/public/images/ProfilePic.jpeg'
import logo from '@/public/images/scilogo.png'

export default   function NavBar() {     
  return (
    <div className='w-full h-full flex items-center justify-around px-1 sm:px-4 lg:px-8 '>
      <div className='sm:w-1/4  flex justify-start   '>
        <Image src={logo} alt='logo' className=' object-cover h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-80'></Image>
      </div>
      <div className='flex-1 flex justify-center   md:text-lg lg:text-xl text-sky-400 text-xs'>
        Missing Mark System
      </div>
      <div className='w-1/4 flex justify-end max-[420px]:hidden md:text-lg lg:text-xl text-xs'>
        <Image src={dp} alt='ProfilePic' className='w-11 h-11 rounded-full' width={1400} height={1400}></Image>
      </div>
    </div>
  )
}