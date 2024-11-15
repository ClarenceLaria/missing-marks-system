'use client'
import React, {Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/Admin/Components/LecturersTable';
import Search from '@/app/(users)/Student/Components/Search'
import { useSession } from 'next-auth/react';
import { fetchSchoolUsers, fetchUniversityUsers } from '@/app/lib/actions';
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
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const session = useSession();
  const email = session.data?.user?.email!;
  const userType = session.data?.userType;
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

    // ADMIN Logic
    const [staff, setStaff] = useState<Lecturer[]>([]);
    useEffect(() => {
      const handleFetchStaff = async () => {
        try{
          setLoading(true);
          const result = await fetchUniversityUsers();
          const staff = result?.lecturers || [];
          setStaff(staff);
          setLoading(false);
        }catch(error){
          console.error("Error fetching staff: ",error);
        }
      };
      handleFetchStaff();
    },[])
  if (loading) return <Loader/>;

  const transformedLecturers = lecturers.map(lecturer => ({
    name: lecturer.firstName + " " + lecturer.secondName,
    email: lecturer.email,
    phoneNo: lecturer.phoneNumber,
    role: lecturer.userType,
  }));

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

  //Admin Logic
  const adminTransformedLecturers = staff.map(lecturer => ({
    name: lecturer.firstName + " " + lecturer.secondName,
    email: lecturer.email,
    phoneNo: lecturer.phoneNumber,
    role: lecturer.userType,
  }));

  const adminFilteredLecturers = adminTransformedLecturers.filter(
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
            {userType === 'DEAN' && (
            <Suspense fallback={<Loading/>}>
              <Table lecturers={filteredLecturers}></Table>
            </Suspense>)}
            {userType === 'ADMIN' && (
            <Suspense fallback={<Loading/>}>
              <Table lecturers={adminFilteredLecturers}></Table> 
            </Suspense>
            )}
        </div>
    </div>
  )
}