import React from 'react'
import Students from '@/public/images/graduation.jpg'
import Logo from '@/public/images/logo.png'
import Image from 'next/image'
import StaffAuthForm from '@/app/Components/StaffAuthForm'

export default function page() {
  return (
    <div className='w-full h-full'>
        <div className="h-screen w-screen flex flex-row">
          <div className="w-full h-full md:block bg-gray-300">
            <Image src={Students} alt="Photo" className="w-full h-full object-cover"></Image>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Image src={Logo} alt="logo" width={1400} height={1400} className="h-20 w-20"></Image>
            <h1>Sign in to your account</h1>
            <div className="">
              <StaffAuthForm/>
            </div>
          </div>
        </div>
    </div>
  )
}
