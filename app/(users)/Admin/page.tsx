'use client'
import { fetchSchoolTotals } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function Page() {
    const [pending, setPending] = useState<number>();
    const [found, setFound] = useState<number>();
    const [notFound, setNotFound] = useState<number>();
    const [forwarded, setForwarded] = useState<number>();
    const [cleared, setCleared] = useState<number>();
    const [totalReports, setTotalReports] = useState<number>();
    const [loading, setLoading] = useState(true);

    const session = useSession();
    const email = session.data?.user?.email!;
    useEffect(()=>{
        const handleFetchSchoolTotals = async() => {
            try{
                setLoading(true);
                const result = await fetchSchoolTotals(email);
                setPending(result?.pendingTotals);
                setFound(result?.markFoundTotals);
                setNotFound(result?.markNotFoundTotals);
                setForwarded(result?.forInvestigationTotals);
                setCleared(result?.totalCleared);
                setTotalReports(result?.totalReports);
                setLoading(false);
            }catch(error){
                console.error('Error fetching pending', error);
            }
        };
        handleFetchSchoolTotals();
    }, [email])
  return (
    <div className='w-full h-full'>
        <div>
            <h1 className='text-2xl font-bold pt-10 px-10 text-center'>Missing Marks Report</h1>
            <div className='w-full py-5 flex flex-row justify-evenly'>
                <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
                <h1>Total Missing Marks</h1>
                <h1>{totalReports}</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Pending Missing Marks</h1>
                    <h1>{pending}</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Missing Marks Found</h1>
                    <h1>{found}</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Missing Marks Not Found</h1>
                    <h1>{notFound}</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Forwarded Missing Marks</h1>
                    <h1>{forwarded}</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Cleared Missing Marks</h1>
                    <h1>{cleared}</h1>
                </div>
            </div>
        </div>
        <div>
            <h1 className='text-2xl font-bold pt-10 px-10 text-center'>Users</h1>
            <div className='w-full py-5 flex flex-row justify-evenly'>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Total Users</h1>
                    <h1>3</h1>
                </div>
                <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
                <h1>Total Students</h1>
                <h1>3</h1>
                </div>
                <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Total Lecturers</h1>
                    <h1>3</h1>
                </div>
            </div>
        </div>
    </div>
  )
}
