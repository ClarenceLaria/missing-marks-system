'use client'
import React, {Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/Admin/Components/LecturersTable';
import Search from '@/app/(users)/Student/Components/Search'
import { useSession } from 'next-auth/react';
import { fetchSchoolUsers } from '@/app/lib/actions';
import { UserType } from '@prisma/client';
import Loader from '@/app/Components/Loader';

interface Lecturer {
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
const Loading = () => <div>Loading...</div>;
export default function Page() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading,setLoading] = useState(true);

  const session = useSession();
  const email = session.data?.user?.email!;

  useEffect(() => {
    const fetchLecturers = async () => {
      try{
        setLoading(true);
        const result = await fetchSchoolUsers(email);
        const lecturers = result?.lecturers || [];
        setLecturers(lecturers);
        setLoading(false);
      }catch(error){
        console.error("Error fetching lecturers: ",error);
      }
    };
    fetchLecturers();
  },[email]);
  if (loading) return <Loader/>;

  const transformedLecturers = lecturers.map(lecturer => ({
    name: lecturer.firstName + " " + lecturer.secondName,
    email: lecturer.email,
    phoneNo: lecturer.phoneNumber,
    role: lecturer.userType,
  }));
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <Suspense fallback={<Loading/>}>
              {/* <Search placeholder='Search for a User...'></Search> */}
            </Suspense>
            <Suspense fallback={<Loading/>}>
              <Table lecturers={transformedLecturers}></Table>
            </Suspense>
        </div>
    </div>
  )
}