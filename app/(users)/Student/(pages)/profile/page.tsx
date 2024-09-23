import Image from 'next/image'
import React from 'react'
import dp from '@/public/images/ProfilePic.jpeg'
import Input from '@/app/Components/Input'
import Button from '@/app/Components/Button'

export default function page() {
  return (
    <div className='w-full h-full items-center mx-auto'>
        <div className='my-10 bg-gray-50 rounded-lg w-1/3 h-3/4 mx-auto border-black'>
            <div className='pt-1'>
            <Image src={dp} width={1400} height={1400} className='rounded-full mx-auto w-20 my-5 h-20' alt='Profile Picture'/>
            </div>
            <div className='w-[18vw] mx-auto'>
                <Input
                    id='FName'
                    name='FirstName'
                    label='First Name'
                    required
                    type='text'
                    placeholder='Clarence'
                    disabled={false}
                    value={''}
                    // onChange={()=>{}}
                />  
            </div>
            <div className='w-[18vw] mx-auto'>
                <Input
                    id='SName'
                    name='SecondName'
                    label='Second Name'
                    required
                    type='text'
                    placeholder='Laria'
                    disabled={false}
                    value={''}
                    // onChange={()=>{}}
                />  
            </div>
            <div className='w-[18vw] mx-auto'>
                <Input
                    id='RegNo'
                    name='RegNo'
                    label='Registration Number'
                    required
                    type='text'
                    placeholder='SIT/B/01-02287/2021'
                    disabled={false}
                    value={''}
                    // onChange={()=>{}}
                />  
            </div>
            <div className='w-[18vw] mx-auto'>
                <Input
                    id='Email'
                    name='Email'
                    label='Email'
                    required
                    type='text'
                    placeholder='clarence@gmail.com'
                    disabled={false}
                    value={''}
                    // onChange={()=>{}}
                />  
            </div>
            <div className='w-[18vw] mx-auto'>
                <Input
                    id='Password'
                    name='Password'
                    label='Password'
                    required
                    type='text'
                    placeholder='********'
                    disabled={false}
                    value={''}
                    // onChange={()=>{}}
                />  
            </div>
            <div className='w-[15vw] mx-auto my-5'>
                <Button type='submit' fullWidth={true} /*onClick={()=>{}}*/disabled={false}>Change Password</Button>
            </div>   
        </div>
    </div>
  )
}
