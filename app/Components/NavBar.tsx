'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import dp from '@/public/images/ProfilePic.jpeg'
import logo from '@/public/images/scilogo.png'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

export default   function NavBar() { 
  const [visible, setVisible] = useState(false);
  const toggle = () => {
    setVisible((prev) => !prev);
  }    

  const handleClickOutside = (event: { target: any }) => {
    setVisible(false);
  };
  useEffect(() => {
    if (visible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [visible]);
  const { data: session } = useSession();
  let profileLink = '/Student/profile'; 

  if (session?.userType === 'LECTURER') {
    profileLink = '/Lecturer/profile';
  } else if (session?.userType === 'COD' ){
    profileLink = '/cod/profile';
  } else if (session?.userType === 'ADMIN' || session?.userType === 'DEAN'){
    profileLink = '/Admin/profile';
  }

  const handleLogout = () => {
    if(session?.userType === 'STUDENT'){
    signOut({callbackUrl: '/'})
    } else {
      signOut({callbackUrl: '/login'})
    }
  };
  return (
    <div className='w-full h-full flex items-center justify-around px-1 sm:px-4 lg:px-8 '>
      <div className='sm:w-1/4  flex justify-start   '>
        <Image src={logo} alt='logo' className=' object-cover h-8 w-36 sm:h-12 sm:w-36 md:h-11 md:w-72 lg:h-16 lg:w-80'></Image>
      </div>
      <div className='flex-1 flex justify-center   md:text-lg lg:text-xl text-sky-400 text-xs'>
        Missing Mark System
      </div>
      <div className='w-1/4 flex justify-end max-[420px]:hidden md:text-lg lg:text-xl text-xs'>
        <Image src={dp} alt='ProfilePic' className='w-11 h-11 rounded-full cursor-pointer hover:opacity-70' onClick={toggle} width={1400} height={1400}></Image>
      </div>
      <div className={clsx(`absolute right-8 top-14 bg-gray-50 rounded-lg w-32 text-center text-sm`, !visible && 'hidden')}>
        <Link href={profileLink}>
        <h1 className='py-3 px-3 hover:bg-gray-100 cursor-pointer border-b-2'>Profile</h1>
        </Link>
        <button className='py-3 px-3 hover:bg-gray-100 cursor-pointer' onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}