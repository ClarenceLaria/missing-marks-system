'use client'
import Loader from '@/app/Components/Loader';
import { fetchDepartmentTotals, fetchDepartmentUserTotals } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { BookOpen, CheckCircle, UserCircle, GraduationCapIcon } from "lucide-react";
import { CourseList } from "@/app/Components/lecturer/course-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/Components/ui/card";
import { MissingMarksTable } from "@/app/Components/lecturer/missing-marks-table";

export default function Page() {
    const [totalReports, setTotalReports] = useState<number>();
    const [pendingTotals, setPendingTotals] = useState(Number);
    const [markFoundTotals, setMarkFoundTotals] = useState(Number);
    const [notFoundTotals, setNotFoundTotals] = useState(Number);
    const [clearedTotals, setClearedTotals] = useState(Number);
    const [forwardedTotals, setForwardedTotals] = useState(Number);
    const [loading, setLoading] = useState(true);
    const [totalLecturers, setTotalLecturers] = useState<number>();
    const [totalStudents, setTotalStudents] = useState<number>()
    const [totalUsers, setTotalUsers] = useState<number>();

    const session= useSession();
    const email = session.data?.user?.email!;
    useEffect(()=>{
        const handleFetchTotals = async() => {
            try{
                setLoading(true);
                const totals = await fetchDepartmentTotals(email) ?? 0;
                if(totals){
                    setTotalReports(totals.totalReports);
                    setPendingTotals(totals.pendingTotals);
                    setMarkFoundTotals(totals.markFoundTotals);
                    setNotFoundTotals(totals.notFoundTotals);
                    setForwardedTotals(totals.forwardedTotals);
                    setClearedTotals(totals.clearedTotals);
                }
                setLoading(false);
            }catch(error){
                console.error('Error fetching totals', error);
            }
        };
        handleFetchTotals();
    }, [email])
        
    useEffect(() => {
        const handleUserTotals = async() =>{
            setLoading(true)
            const userTotals = await fetchDepartmentUserTotals(email);
            if(userTotals){
                setTotalLecturers(userTotals.lecturers);
                setTotalStudents(userTotals.students);
                setTotalUsers(userTotals.totalUsers);
            }
        }
        handleUserTotals();
    }, [email])
    if (loading) return <Loader/>;
  return (
    // <div className='w-full h-full'>
    //     <div>
    //         <h1 className='text-2xl font-bold pt-10 px-10 text-center'>Missing Marks Report</h1>
    //         <div className='w-full py-5 flex flex-row justify-evenly'>
    //             <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
    //             <h1>Total Missing Marks</h1>
    //             <h1>{totalReports}</h1>
    //             </div>
    //             <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                 <h1>Pending Missing Marks</h1>
    //                 <h1>{pendingTotals}</h1>
    //             </div>
    //             <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                 <h1>Missing Marks Found</h1>
    //                 <h1>{markFoundTotals}</h1>
    //             </div>
    //             <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                 <h1>Missing Marks Not Found</h1>
    //                 <h1>{notFoundTotals}</h1>
    //             </div>
    //             <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                 <h1>Forwarded Missing Marks</h1>
    //                 <h1>{forwardedTotals}</h1>
    //             </div>
    //             <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                 <h1>Cleared Missing Marks</h1>
    //                 <h1>{clearedTotals}</h1>
    //             </div>
    //         </div>
    //     </div>
    //     <div>
    //         <h1 className='text-2xl font-bold pt-10 px-10 text-center'>Users</h1>
    //         <div className='w-full py-5 flex flex-row justify-evenly'>
    //             <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                 <h1>Total Users</h1>
    //                 <h1>{totalUsers}</h1>
    //             </div>
    //             <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
    //             <h1>Total Students</h1>
    //             <h1>{totalStudents}</h1>
    //             </div>
    //             <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                 <h1>Total Lecturers</h1>
    //                 <h1>{totalLecturers}</h1>
    //             </div>
    //         </div>
    //     </div>
    // </div>
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Marks Reports</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCapIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lecturers</CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLecturers}</div>
          </CardContent>
        </Card>
      </div>
      <CourseList />
      <MissingMarksTable />
    </div>
  )
}
