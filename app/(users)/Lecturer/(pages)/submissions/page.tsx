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
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  useEffect(() => {
    const handleFetchReports = async () => {
        try{
            setLoading(true)
            const fetchedReports = await fetchLecturerMissingMarks();
            setReports(fetchedReports);
            setLoading(false)
        }catch(error){
          console.error('Error fetching missing marks report:', error)
        }
    }
    handleFetchReports();
  }, [])
  if (loading) return <Loader/>
  const transformedReports = reports.map(report => ({
    id: report.id,
    title: report.unitName,
    unitCode: report.unitCode,
    date: report.createdAt,
    status: report.reportStatus,
  }));

  const filteredReports = transformedReports.filter(
    (report) => {
      const matchesSearchTerm =
      !searchTerm ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.unitCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = 
      !searchDate || report.date.toDateString() === searchDate.toDateString();

      return matchesSearchTerm && matchesDate;
  });
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <h1 className='text-2xl font-bold'>Uncleared Missing Marks</h1>
            <Suspense fallback={<Loading/>}>
                <Search 
                  placeholder='Search for a Pending Missing Mark...'
                  onSearch = {(term, date) => {
                      setSearchDate(date);
                      setSearchTerm(term);
                  }}
                ></Search>
            </Suspense>
            <Suspense fallback={<Loading/>}>
              <Table pageType='submissions' reports={filteredReports}></Table>
            </Suspense>
        </div>
    </div>
  )
}
