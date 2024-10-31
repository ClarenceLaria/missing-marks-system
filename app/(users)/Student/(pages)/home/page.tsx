'use client'
import Loader from '@/app/Components/Loader';
import { fetchReportNumbers } from '@/app/lib/actions';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

export default function Page() {
    const [loading,setLoading] = useState(true);
    const [totals, setTotals] = useState(Number)
    const [pendingTotals, setPendingTotals] = useState(Number)
    const [markFoundTotals, setMarkFoundTotals] = useState(Number)
    const [notFoundTotals, setNotFoundTotals] = useState(Number)
    const [investigationTotals, setInvestigationTotals] = useState(Number)

    const session = useSession();
    const email = session.data?.user?.email!;

    useEffect(() => {
        const handleReportTotals = async () => {
            setLoading(true)
            const totals = await fetchReportNumbers(email);
            setTotals(totals.TotalReports)
            setPendingTotals(totals.pendingTotals)
            setMarkFoundTotals(totals.markFoundTotals)
            setNotFoundTotals(totals.markNotFoundTotals)
            setInvestigationTotals(totals.forInvestigationTotals)
            setLoading(false)
        }
        handleReportTotals()
    },[email])
    
    
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
