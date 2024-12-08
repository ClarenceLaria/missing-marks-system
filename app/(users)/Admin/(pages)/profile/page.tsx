'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import dp from '@/public/images/ProfilePic.jpeg'
import Input from '@/app/Components/Input'
import Button from '@/app/Components/Button'
import { useSession } from 'next-auth/react'
import { fetchStaffProfile } from '@/app/lib/actions'
import { UserType } from '@prisma/client'
import Loader from '@/app/Components/Loader'

interface StaffProfile {
    id: number;
    createdAt: Date;
    email: string;
    firstName: string;
    secondName: string;
    phoneNumber: string;
    password: string;
    userType: UserType;
    departmentId: number;
}

export default function Page() {
    const [staff, setStaff] = useState<StaffProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const session = useSession();
    const email = session.data?.user?.email!;
    
    useEffect(() => {
        async function fetchProfile(){
            try{
                const lecturerProfile = await fetchStaffProfile();
                setStaff(lecturerProfile);
            }catch(error){
                console.error('Error fetching student profile:', error)
            } finally{
                setLoading(false);
            }
        }
        fetchProfile();
    },[email])
    if (loading) return <Loader/>
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
                    placeholder={staff?.firstName || ''}
                    disabled={false}
                    value={''}
                />  
            </div>
            <div className='w-[18vw] mx-auto'>
                <Input
                    id='SName'
                    name='SecondName'
                    label='Second Name'
                    required
                    type='text'
                    placeholder={staff?.secondName || ''}
                    disabled={false}
                    value={''}
                />  
            </div>
            <div className='w-[18vw] mx-auto'>
                <Input
                    id='PhoneNo'
                    name='PhoneNo'
                    label='Phone Number'
                    required
                    type='text'
                    placeholder={staff?.phoneNumber || ''}
                    disabled={false}
                    value={''}
                />  
            </div>
            <div className='w-[18vw] mx-auto'>
                <Input
                    id='Email'
                    name='Email'
                    label='Email'
                    required
                    type='text'
                    placeholder={staff?.email || ''}
                    disabled={false}
                    value={''}
                />  
            </div>
            <div className='w-[18vw] mx-auto'>
                <Input
                    id='Password'
                    name='Password'
                    label='Password'
                    required
                    type='text'
                    placeholder='****************'
                    disabled={false}
                    value={''}
                />  
            </div>
        </div>
    </div>
  )
}
