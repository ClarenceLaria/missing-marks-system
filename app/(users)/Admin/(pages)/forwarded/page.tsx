'use client'
import React, { Suspense, useEffect, useState } from 'react';
import Table from '@/app/(users)/Admin/Components/Table'
import Search from '@/app/(users)/Student/Components/Search';
import { ExamType, ReportStatus, Semester } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { fetchSchoolReports, fetchUniversityMissingReports } from '@/app/lib/actions';
import Loader from '@/app/Components/Loader';

const Loading = () => <div>Loading...</div>;
interface missingReport {
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
  const [reports, setReports] = useState<missingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  const session = useSession();
  const email = session.data?.user?.email!;
  const userType = session.data?.userType;
  useEffect(() => {
    const handleFetchReports = async () => {
      try{
        setLoading(true);
        const result = await fetchSchoolReports(email);
        const forwardedReports = result?.forwardedReports || [];
        setReports(forwardedReports);
        setLoading(false);
      }catch(error){
        console.log("Error fetching reports: ", error);
      }
    };
    handleFetchReports();
  },[email]);

  //Admin Logic
  const [adminReports, setAdminReports] = useState<missingReport[]>([]);
  useEffect(() => {
    const handleFecthReports = async () => {
      try{
        setLoading(true);
        const result = await fetchUniversityMissingReports();
        setAdminReports(result?.forInvestigation || []);
        setLoading(false);
      }catch(error){
        console.error("Error fetching Reports: ", error)
      }
    };
    handleFecthReports();
  },[])
  if (loading) return <Loader/>;

  const transformedReports = reports.map((report) => ({
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

  //Admin Logic
  const adminTransformed = adminReports.map((report) => ({
    id: report.id,
    title: report.unitName,
    unitCode: report.unitCode,
    date: report.createdAt,
    status: report.reportStatus,
  }))

  const adminFiltered = adminTransformed.filter(
    (report) => {
      const matchesSearchTerm =
        !searchTerm ||
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.unitCode.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = 
        !searchDate || report.date.toDateString() === searchDate.toDateString();

        return matchesSearchTerm && matchesDate;
  })
  return (
    <div className="w-full h-full">
      <div className="p-10">
        <Suspense fallback={<Loading />}>
            <Search 
              placeholder='Search for a Pending Missing Mark...'
              onSearch = {(term, date) => {
                  setSearchDate(date);
                  setSearchTerm(term);
              }}
            ></Search>        
        </Suspense>
        {userType === 'DEAN' && (
          <Suspense fallback={<Loading />}>
            <Table pageType='forwarded' reports={filteredReports}/>
          </Suspense>
        )}
        {userType === 'ADMIN' && (
          <Suspense fallback={<Loading />}>
            <Table pageType='forwarded' reports={adminFiltered}/>
          </Suspense>
        )}
      </div>
    </div>
  );
}