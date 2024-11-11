'use client'
import React, { Suspense, useEffect, useState } from 'react';
import Table from '@/app/(users)/Admin/Components/Table'
import Search from '@/app/(users)/Student/Components/Search';
import { ExamType, ReportStatus, Semester } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { fetchSchoolReports } from '@/app/lib/actions';
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

  const session = useSession();
  const email = session.data?.user?.email!;
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
  },[email])
  if (loading) return <Loader/>;

  const transformedReports = reports.map((report) => ({
    id: report.id,
    title: report.unitName,
    unitCode: report.unitCode,
    date: report.createdAt,
    status: report.reportStatus,
  }));
  return (
    <div className="w-full h-full">
      <div className="p-10">
        <Suspense fallback={<Loading />}>
          <Search placeholder="Search for a User..." />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <Table pageType='forwarded' reports={transformedReports}/>
        </Suspense>
      </div>
    </div>
  );
}