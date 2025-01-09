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
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  useEffect(() => {
    const handlefetchReports = async () => {
      try {
        const reports = await fetchDepartmentReports();
        setReports(reports?.clearedReports ?? []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error)
      }
    }
    handlefetchReports();
  }, [])

  const transformedReports = reports.map(report => ({
    id: report.id,
    title: report.unitName,
    unitCode: report.unitCode,
    date: report.createdAt,
    status: report.reportStatus,
  }));

  if(loading) return <Loader/>;

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
            <h1 className='text-2xl font-bold'>Cleared Missing Marks</h1>
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
              <Table pageType='cleared' reports={filteredReports}></Table>
            </Suspense>
        </div>
    </div>
  )
}
