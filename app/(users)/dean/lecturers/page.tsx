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
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = () => {
    setOpenDelete((prev) => !prev);
  }

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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">School</h2>
          <p className="text-muted-foreground">
            Manage school&apos;s staff
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
          <CardDescription>A list of all schools staff</CardDescription>
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

      {/* <CreateSchoolDialog open={open} onOpenChange={setOpen}/>
      <DeleteSchoolDialog id={id} open={openDelete}/> */}
    </div>
  )
}