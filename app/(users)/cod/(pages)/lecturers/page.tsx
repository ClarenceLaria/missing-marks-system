'use client'
import React, {Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/Admin/Components/LecturersTable';
import Search from '@/app/(users)/Student/Components/Search'
import { useSession } from 'next-auth/react';
import { fetchDepartmentUsers } from '@/app/lib/actions';
import { UserType } from '@prisma/client';
import Loader from '@/app/Components/Loader';

interface Lecturers{
    id: number;
    createdAt: Date;
    email: string;
    firstName: string;
    secondName: string;
    password: string;
    departmentId: number;
    userType: UserType;
    phoneNumber: string;
}
const Loading = () => <div>Loading...</div>;
export default function Page() {
  const [lecturers, setLecturers] = useState<Lecturers[]>([])
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const session = useSession();
  const email = session.data?.user?.email!;
  useEffect(() => {
    const handleFetchLecturers = async() => {
      setLoading(true)
      const users = await fetchDepartmentUsers(email);
      setLecturers(users.lecturers);
      setLoading(false)
    }
    handleFetchLecturers();
  },[email])

  const transformedLecturers = lecturers.map(lecturer => ({
    name: lecturer.firstName + " " + lecturer.secondName,
    email: lecturer.email,
    phoneNo: lecturer.phoneNumber,
    role: lecturer.userType,
  }))
  if (loading) return <Loader/>;

  const filteredLecturers = transformedLecturers.filter(
    (lecturer) => {
      const matchesSearchTerm =
      !searchTerm ||
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.phoneNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.role.toLowerCase().includes(searchTerm.toLowerCase());

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
              <Table lecturers={filteredLecturers}></Table>
            </Suspense>
        </div>
    </div>
  )
}