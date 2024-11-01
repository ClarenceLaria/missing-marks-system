'use client'
import React, {Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/Lecturer/Components/Table'
import Search from '@/app/(users)/Student/Components/Search'
import { ExamType, ReportStatus, Semester } from '@prisma/client';
import { fetchLecturerMissingMarks } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Loader from '@/app/Components/Loader';

const Loading = () => <div>Loading...</div>;
interface missingReport {
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
export default function Page() {
  const [reports, setReports] = useState<missingReport[]>([]);
  const [loading,setLoading] = useState(true);

  const session = useSession();
  const email = session.data?.user?.email!; 
  useEffect(() => {
    const handleFetchReports = async () => {
        try{
            setLoading(true)
            const fetchedReports = await fetchLecturerMissingMarks(email);
            setReports(fetchedReports);
            setLoading(false)
            toast.success('Missing Marks Reports Fetched Successfully')
        }catch(error){
          toast.error('Failed to fetch missing marks reports')
          console.error('Error fetching missing marks report:', error)
        }
    }
    handleFetchReports();
  }, [email])
  if (loading) return <Loader/>
  const transformedReports = reports.map(report => ({
    id: report.id,
    title: report.unitName,
    unitCode: report.unitCode,
    date: report.createdAt,
    status: report.reportStatus,
  }));
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <h1 className='text-2xl font-bold'>Uncleared Missing Marks</h1>
            <Suspense fallback={<Loading/>}>
              <Search placeholder='Search for a Reported Missing mark...'></Search>
            </Suspense>
            <Suspense fallback={<Loading/>}>
              <Table pageType='submissions' reports={transformedReports}></Table>
            </Suspense>
        </div>
    </div>
  )
}
