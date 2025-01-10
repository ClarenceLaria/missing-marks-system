'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/Components/ui/table";
import { Button } from "@/app/Components/ui/button";
import { PenSquare, Trash2 } from "lucide-react";
import React, {Suspense, useEffect, useState} from 'react'
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
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = () => {
    setOpenDelete((prev) => !prev);
  }
  
  useEffect(() => {
    const handleFetchLecturers = async() => {
      setLoading(true)
      const users = await fetchDepartmentUsers();
      setLecturers(users.lecturers);
      setLoading(false)
    }
    handleFetchLecturers();
  },[])

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
    // <div className='w-full h-full'>
    //     <div className='p-10'>
    //         <Suspense fallback={<Loading/>}>
    //             <Search 
    //               placeholder='Search for a Pending Missing Mark...'
    //               onSearch = {(term) => {
    //                   setSearchTerm(term);
    //               }}
    //             ></Search> 
    //         </Suspense>
    //         <Suspense fallback={<Loading/>}>
    //           <Table lecturers={filteredLecturers}></Table>
    //         </Suspense>
    //     </div>
    // </div>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Department</h2>
          <p className="text-muted-foreground">
            Manage department&apos;s staff
          </p>
        </div>
        <div>
          <Suspense fallback={<Loading/>}>
            <Search 
            placeholder='Search for a Lecturer...'
            onSearch = {(term) => {
                setSearchTerm(term);
            }}
            ></Search>            
          </Suspense>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lecturers</CardTitle>
          <CardDescription>A list of all Department staff</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lecturer&apos;s Name</TableHead>
                <TableHead>email</TableHead>
                <TableHead>phone No.</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLecturers.length > 0 ? (
                filteredLecturers.map((lecturer) => (
                  <TableRow key={lecturer.email}>
                    <TableCell className="font-medium">{lecturer.name}</TableCell>
                    <TableCell>{lecturer.email}</TableCell>
                    <TableCell>{lecturer.phoneNo}</TableCell>
                    <TableCell>{lecturer.role}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {handleOpenDelete(); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center ">
                  There are no Lecturers here!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}