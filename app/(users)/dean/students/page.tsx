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
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [openDelete, setOpenDelete] = useState(false);

    const handleOpenDelete = () => {
        setOpenDelete((prev) => !prev);
      }
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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">School</h2>
          <p className="text-muted-foreground">
            Manage school&apos;s students
          </p>
        </div>
        <div>
          <Suspense fallback={<Loading/>}>
            <Search 
            placeholder='Search for a student...'
            onSearch = {(term) => {
                setSearchTerm(term);
            }}
            ></Search>            
          </Suspense>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>A list of all school&apos;s students</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student&apos;s Name</TableHead>
                <TableHead>email</TableHead>
                <TableHead>Registration No.</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.email}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.regNo}</TableCell>
                    <TableCell>{student.role}</TableCell>
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
                  There are no students here!
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