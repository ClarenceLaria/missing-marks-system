'use client'
import React,{Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/Admin/Components/Table'
import Search from '@/app/(users)/Student/Components/Search'
import { useSession } from 'next-auth/react';
import { fetchDepartmentReports } from '@/app/lib/actions';
import { ExamType, ReportStatus, Semester } from '@prisma/client';
import Loader from '@/app/Components/Loader';

const Loading = () => <div>Loading...</div>;
interface Report {
  id: number;
  createdAt: Date;
  unitName: string;
  unitCode: string;
  lecturerName: string;
  academicYear: string;
  examType: ExamType;
  reportStatus: ReportStatus;
  yearOfStudy: number;
  semester: Semester;
  studentId: number;
  unitId: number;
}
export default function Page() {
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  const session = useSession();
  const email = session.data?.user?.email!;
  useEffect(() => {
    const handleFetchReports = async () => {
      setLoading(true);
      const reports = await fetchDepartmentReports(email);
      setPendingReports(reports?.pendingReports || []);
      setLoading(false);
    }
    handleFetchReports();
  },[email])
  if (loading) return <Loader/>;

  const transformedReports = pendingReports?.map(pending => ({
    id: pending.id,
    title: pending.unitName,
    unitCode: pending.unitCode,
    date: pending.createdAt,
    status: pending.reportStatus,
  }))

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
                <Table pageType='pending' reports={filteredReports}></Table>
            </Suspense>
        </div>
    </div>
  )
}