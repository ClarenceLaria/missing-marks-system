'use client'
import { fetchLecturerMissingMarksTotals } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [totals, setTotals] = useState(Number);
  const [pendingTotals, setPendingTotals] = useState(Number);
  const [markFoundTotals, setMarkFoundTotals] = useState(Number);
  const [notFoundTotals, setNotFoundTotals] = useState(Number);
  const [investigationTotals, setInvestigationTotals] = useState(Number);
  const [clearedMarks, setClearedMarks] = useState(Number);

  const session = useSession();
  const email = session.data?.user?.email!;

  useEffect(() => {
    const handleReportTotals = async () => {
      const totals = await fetchLecturerMissingMarksTotals(email);
      setTotals(totals.totalLecsMissingMarks);
      setPendingTotals(totals.pendingTotals);
      setMarkFoundTotals(totals.markFoundTotals);
      setNotFoundTotals(totals.markNotFoundTotals);
      setClearedMarks(totals.totalCleared);
      setInvestigationTotals(totals.forInvestigationTotals);
    }
    handleReportTotals();
  }, [email]);
  console.log(totals)
  return (
    <div className='w-full h-full'>
        <div className='w-full py-5 flex flex-row justify-evenly'>
            <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
            <h1>Total Missing Marks</h1>
            <h1>{totals}</h1>
            </div>
            <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
            <h1>Pending Missing Marks</h1>
            <h1>{pendingTotals}</h1>
            </div>
            <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
              <h1>Missing Marks Found</h1>
              <h1>{markFoundTotals}</h1>
            </div>
            <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
              <h1>Missing Marks Not Found</h1>
              <h1>{notFoundTotals}</h1>
            </div>
            <div className='w-44 h-44 rounded-lg shadow-lg text-center flex flex-col justify-center items-center'>
                <h1>Cleared Marks</h1>
                <h1>{clearedMarks}</h1>
            </div>
            <div className='w-44 h-44 rounded-lg shadow-lg text-center flex flex-col justify-center items-center'>
                <h1>Forwarded For Investigation</h1>
                <h1>{investigationTotals}</h1>
            </div>
        </div>
    </div>
  )
}
