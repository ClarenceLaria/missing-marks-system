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
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

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

  const filteredStudents = transformedStudents.filter(
    (student) => {
      const matchesSearchTerm =
      !searchTerm ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.role.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearchTerm;
  });
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <Suspense fallback={<Loading/>}>
                <Search 
                  placeholder='Search for a Pending Missing Mark...'
                  onSearch = {(term) => {
                      setSearchTerm(term);
                  }}
                ></Search> 
            </Suspense>
            <Suspense fallback={<Loading/>}>
              <Table students={filteredStudents}></Table>
            </Suspense>
        </div>
    </div>
  )
}