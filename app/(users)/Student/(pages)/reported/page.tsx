'use client'
import React, {Suspense, useEffect, useState} from 'react'
import Search from '../../Components/Search'
import Card from '../../Components/Card'
import Table from '../../Components/Table'
import { useSession } from 'next-auth/react';
import { ExamType, ReportStatus, Semester } from '@prisma/client';
import { fetchMissingReports } from '@/app/lib/actions';
import toast from 'react-hot-toast';
import Loader from '@/app/Components/Loader';

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
const Loading = () => <div>Loading...</div>;
export default function Page() {
  const [reports, setReports] = useState<missingReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading,setLoading] = useState(true);

  const session = useSession();
  const email = session.data?.user?.email!;
  useEffect(() => {
    const handleFetchReports = async () => {
        if (!email) {
            setError('Email is required');
            return;
          }
        try{
            setLoading(true)
            const fetchedReports = await fetchMissingReports(email);
            setReports(fetchedReports);
            setLoading(false)
            toast.success('Missing Marks Reports Fetched Successfully')
        }catch(error){
            console.error('Error fetching missing marks report:', error)
            toast.error('Failed to fetch missing marks reports')
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
    <div className='w-full h-full p-10'>
        <Suspense fallback={<Loading/>}>
          {/* <Search placeholder='Search for a Reported Missing mark...'></Search> */}
        </Suspense>
        <Suspense fallback={<Loading/>}>
          <Table reports={transformedReports} ></Table>
        </Suspense>
       
    </div>
  )
}
