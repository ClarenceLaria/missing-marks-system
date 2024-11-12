'use client'
import React, {Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/Admin/Components/UserTable'
import Search from '@/app/(users)/Student/Components/Search'
import { useSession } from 'next-auth/react';
import { fetchDepartmentUsers } from '@/app/lib/actions';
import { UserType } from '@prisma/client';
import Loader from '@/app/Components/Loader';

interface Student {
  id: number;
  createdAt: Date;
  email: string;
  firstName: string;
  secondName: string;
  password: string;
  regNo: string;
  departmentId: number;
  courseId: number;
  userType: UserType;
}
const Loading = () => <div>Loading...</div>;
export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const email = session.data?.user?.email!;
  useEffect(() => {
    const handleFetchStudents = async () => {
      setLoading(true);
      const users = await fetchDepartmentUsers(email);
      setStudents(users.students);
      setLoading(false);
    }
    handleFetchStudents();
  },[email])
  if (loading) return <Loader/>;

  const transformedStudents = students.map(student => ({
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
              <Table students={transformedStudents}></Table>
            </Suspense>
        </div>
    </div>
  )
}