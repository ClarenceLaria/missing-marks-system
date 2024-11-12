'use client'
import React, {Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/Admin/Components/UserTable'
import Search from '@/app/(users)/Student/Components/Search'
import { useSession } from 'next-auth/react';
import { fetchSchoolUsers } from '@/app/lib/actions';
import { UserType } from '@prisma/client';
import Loader from '@/app/Components/Loader';

interface Student {
  id: number;
  createdAt: Date;
  email: string;
  firstName: string;
  secondName: string;
  password: string;
  userType: UserType;
  departmentId: number;
  regNo: string;
  courseId: number;
}
const Loading = () => <div>Loading...</div>;
export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const email = session.data?.user?.email!;
  useEffect(() => {
    const handleFetchStudents = async() => {
      setLoading(true)
      const users = await fetchSchoolUsers(email);
      const students = users?.students || [];
      setStudents(students);
      setLoading(false)
    }
    handleFetchStudents();
  },[email])
  if (loading) return <Loader/>;

  const transformedStudent = students.map(student => ({
    name: student.firstName + " " + student.secondName,
    email: student.email,
    regNo: student.regNo,
    role: student.userType,
  }))
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <Suspense fallback={<Loading/>}>
              {/* <Search placeholder='Search for a User...'></Search> */}
            </Suspense>
            <Suspense fallback={<Loading/>}>
              <Table students={transformedStudent}></Table>
            </Suspense>
        </div>
    </div>
  )
}