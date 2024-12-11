'use client'
import Loader from '@/app/Components/Loader';
import { fetchLecturerMissingMarksTotals } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/Components/ui/card";
import { CourseList } from "@/app/Components/lecturer/course-list";
import { MissingMarksTable } from "@/app/Components/lecturer/missing-marks-table";
import { BookOpen, CheckCircle, AlertCircle } from "lucide-react";

export default function Page() {
  const [totals, setTotals] = useState(Number);
  const [pendingTotals, setPendingTotals] = useState(Number);
  const [markFoundTotals, setMarkFoundTotals] = useState(Number);
  const [notFoundTotals, setNotFoundTotals] = useState(Number);
  const [investigationTotals, setInvestigationTotals] = useState(Number);
  const [clearedMarks, setClearedMarks] = useState(Number);
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const email = session.data?.user?.email!;

  useEffect(() => {
    const handleReportTotals = async () => {
      setLoading(true);
      const totals = await fetchLecturerMissingMarksTotals(email);
      setTotals(totals.totalLecsMissingMarks);
      setPendingTotals(totals.pendingTotals);
      setMarkFoundTotals(totals.markFoundTotals);
      setNotFoundTotals(totals.markNotFoundTotals);
      setClearedMarks(totals.totalCleared);
      setInvestigationTotals(totals.forInvestigationTotals);
      setLoading(false);
    }
    handleReportTotals();
  }, [email]);

  if (loading) return <Loader/>;
  return (
    // <div className='w-full h-full'>
    //     <div className='w-full py-5 flex flex-row justify-evenly'>
    //         <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
    //         <h1>Total Missing Marks</h1>
    //         <h1>{totals}</h1>
    //         </div>
    //         <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
    //         <h1>Pending Missing Marks</h1>
    //         <h1>{pendingTotals}</h1>
    //         </div>
    //         <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
    //           <h1>Missing Marks Found</h1>
    //           <h1>{markFoundTotals}</h1>
    //         </div>
    //         <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
    //           <h1>Missing Marks Not Found</h1>
    //           <h1>{notFoundTotals}</h1>
    //         </div>
    //         <div className='w-44 h-44 rounded-lg shadow-lg text-center flex flex-col justify-center items-center'>
    //             <h1>Cleared Marks</h1>
    //             <h1>{clearedMarks}</h1>
    //         </div>
    //         <div className='w-44 h-44 rounded-lg shadow-lg text-center flex flex-col justify-center items-center'>
    //             <h1>Forwarded For Investigation</h1>
    //             <h1>{investigationTotals}</h1>
    //         </div>
    //     </div>
    // </div>
        <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
            </CardContent>
          </Card>
        </div>
        <CourseList />
        <MissingMarksTable />
      </div>
  )
}
