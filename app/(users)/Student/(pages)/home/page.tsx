'use client'
import Loader from '@/app/Components/Loader';
import { fetchMissingReports, fetchReportNumbers } from '@/app/lib/actions';
import { ExamType, ReportStatus, Semester } from '@prisma/client';
import { useSession } from 'next-auth/react'
import { report } from 'process';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';


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
}
export default function Page() {
    const [reports, setReports] = useState<missingReport[]>([]);
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totals, setTotals] = useState(Number)
    const [pendingTotals, setPendingTotals] = useState(Number)
    const [markFoundTotals, setMarkFoundTotals] = useState(Number)
    const [notFoundTotals, setNotFoundTotals] = useState(Number)
    const [investigationTotals, setInvestigationTotals] = useState(Number)

    const session = useSession();
    const email = session.data?.user?.email!;
    console.log(email)

    useEffect(() => {
        const handleReportTotals = async () => {
            const totals = await fetchReportNumbers(email);
            setTotals(totals.TotalReports)
            setPendingTotals(totals.pendingTotals)
            setMarkFoundTotals(totals.markFoundTotals)
            setNotFoundTotals(totals.markNotFoundTotals)
            setInvestigationTotals(totals.forInvestigationTotals)
        }
        handleReportTotals()
    },[email])
    
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
            }catch{
                console.error('Error fetching missing marks report:', error)
                toast.error('Failed to fetch missing marks reports')
            }
        }
        handleFetchReports();
    }, [email])
    if (loading) return <Loader/>
  return (
    <div className='w-full h-full'>
        <div className='w-full py-5 flex flex-row justify-evenly'>
            <div className='w-44 h-44 rounded-lg shadow-lg text-center flex flex-col justify-center items-center'>
                <h1>Reported Missing Marks</h1>
                <h1>{totals}</h1>
            </div>
            <div className='w-44 h-44 rounded-lg shadow-lg text-center flex flex-col justify-center items-center'>
                <h1>Pending Reported Marks</h1>
                <h1>{pendingTotals}</h1>
            </div>
            <div className='w-44 h-44 rounded-lg shadow-lg text-center flex flex-col justify-center items-center'>
                <h1>Reported Marks Found</h1>
                <h1>{markFoundTotals}</h1>
            </div>
            <div className='w-44 h-44 rounded-lg shadow-lg text-center flex flex-col justify-center items-center'>
                <h1>Marks Not Found</h1>
                <h1>{notFoundTotals}</h1>
            </div>
            <div className='w-44 h-44 rounded-lg shadow-lg text-center flex flex-col justify-center items-center'>
                <h1>For Investigation</h1>
                <h1>{investigationTotals}</h1>
            </div>
        </div>
    </div>
  )
}
