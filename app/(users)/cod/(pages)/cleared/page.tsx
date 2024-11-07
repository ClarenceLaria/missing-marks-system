'use client'
import React,{Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/Admin/Components/Table'
import Search from '@/app/(users)/Student/Components/Search'
import { fetchDepartmentReports } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import { ExamType, ReportStatus, Semester } from '@prisma/client';
import Loader from '@/app/Components/Loader';
import toast from 'react-hot-toast';

interface missingReport{
  academicYear: string;
  yearOfStudy: number;
  semester: Semester;
  examType: ExamType;
  lecturerName: string;
  id: number;
  unitName: string;
  unitCode: string;
  reportStatus: ReportStatus;
  studentId: number;
  createdAt: Date;
}
const Loading = () => <div>Loading...</div>;
export default function Page() {
  const [reports, setReports] = useState<missingReport[]>([]);
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const email = session.data?.user?.email!;
  useEffect(() => {
    const handlefetchReports = async () => {
      try {
        const reports = await fetchDepartmentReports(email);
        setReports(reports?.clearedReports ?? []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error)
        toast.error('Failed to fetch Cleared Missing Marks')
      }
    }
    handlefetchReports();
  }, [email])

  const transformedReports = reports.map(report => ({
    id: report.id,
    title: report.unitName,
    unitCode: report.unitCode,
    date: report.createdAt,
    status: report.reportStatus,
  }));

  if(loading) return <Loader/>
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <h1 className='text-2xl font-bold'>Cleared Missing Marks</h1>
            <Suspense fallback={<Loading/>}>
              <Search placeholder='Search for a Cleared Missing mark...'></Search>
            </Suspense>
            <Suspense fallback={<Loading/>}>
              <Table pageType='cleared' reports={transformedReports}></Table>
            </Suspense>
        </div>
    </div>
  )
}
