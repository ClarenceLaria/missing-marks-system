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
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  useEffect(() => {
    const handleFetchReports = async () => {
        try{
            setLoading(true)
            const fetchedReports = await fetchMissingReports();
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
      report.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = 
      !searchDate || report.date.toDateString() === searchDate.toDateString();

      return matchesSearchTerm && matchesDate;
  });
  return (
    <div className='w-full h-full p-10'>
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
          <Table reports={filteredReports} ></Table>
        </Suspense>
       
    </div>
  )
}
