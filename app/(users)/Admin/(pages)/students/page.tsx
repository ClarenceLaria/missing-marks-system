'use client'
import React, {Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/Admin/Components/UserTable'
import Search from '@/app/(users)/Student/Components/Search'
import { useSession } from 'next-auth/react';
import { fetchSchoolUsers, fetchUniversityUsers } from '@/app/lib/actions';
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
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const session = useSession();
  const email = session.data?.user?.email!;
  const userType = session.data?.userType;
  useEffect(() => {
    const handleFetchStudents = async() => {
      setLoading(true)
      const users = await fetchSchoolUsers(email);
      const students = users?.students || [];
      setStudents(students);
      setLoading(false)
    }
    handleFetchStudents();
  },[email]);

  //Admin's Logic
  const [adminStudents, setAdminStudents] = useState<Student[]>([]);
  useEffect(() => {
    const handleFetchStudents = async() => {
      try{
        setLoading(true);
        const result = await fetchUniversityUsers();
        setAdminStudents(result?.students || []);
        setLoading(false)
      }catch(error){
        console.error("Error Fetching Students: ", error);
      }
    };
    handleFetchStudents();
  },[]);
  if (loading) return <Loader/>;

  const transformedStudent = students.map(student => ({
    name: student.firstName + " " + student.secondName,
    email: student.email,
    regNo: student.regNo,
    role: student.userType,
  }))

  const filteredStudents = transformedStudent.filter(
    (student) => {
      const matchesSearchTerm =
      !searchTerm ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.role.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearchTerm;
  });

  //Admin Logic
  const adminTransformedStudent = adminStudents.map(student => ({
    name: student.firstName + " " + student.secondName,
    email: student.email,
    regNo: student.regNo,
    role: student.userType,
  }));

  const adminFilteredStudents = adminTransformedStudent.filter(
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
            {userType === 'DEAN' && (
              <Suspense fallback={<Loading/>}>
              <Table students={filteredStudents}></Table>
            </Suspense>)}
            {userType === 'ADMIN' && (
              <Suspense fallback={<Loading/>}>
              <Table students={adminFilteredStudents}></Table>
            </Suspense>
            )}
        </div>
    </div>
  )
}