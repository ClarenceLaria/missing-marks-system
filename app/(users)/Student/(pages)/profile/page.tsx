'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import dp from '@/public/images/ProfilePic.jpeg'
import Input from '@/app/Components/Input'
import Button from '@/app/Components/Button'
import { useSession } from 'next-auth/react'
import { fetchStudentProfile } from '@/app/lib/actions'
import { UserType } from '@prisma/client'

interface StudentProfile {
    id: number;
    courseId: number;
    createdAt: Date;
    email: string;
    firstName: string;
    secondName: string;
    password: string;
    regNo: string;
    departmentId: number;
    userType: UserType;
}

export default function page() {
    const [student, setStudent] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const session = useSession();
    const email = session.data?.user?.email!;
    
    useEffect(() => {
        async function fetchProfile(){
            try{
                const studentProfile = await fetchStudentProfile(email);
                setStudent(studentProfile);
            }catch(error){
                console.error('Error fetching student profile:', error)
            } finally{
                setLoading(false);
            }
        }
        fetchProfile();
    },[email])
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
                    placeholder={student?.firstName || ''}
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
                    placeholder={student?.secondName || ''}
                    disabled={false}
                    value={''}
                />  
            </div>
            <div className='w-[18vw] mx-auto'>
                <Input
                    id='RegNo'
                    name='RegNo'
                    label='Registration Number'
                    required
                    type='text'
                    placeholder={student?.regNo || ''}
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
                    placeholder={student?.email || ''}
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
