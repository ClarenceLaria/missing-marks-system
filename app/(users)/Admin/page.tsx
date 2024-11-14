'use client'
import Loader from '@/app/Components/Loader';
import { fetchAdminTotals, fetchMissingReportsStats, fetchSchoolTotals, fetchSchoolUsersTotals } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Paper, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UsersIcon, ClockIcon, DocumentCheckIcon, PaperAirplaneIcon, UserGroupIcon, AcademicCapIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

export default function Page() {
    const [pending, setPending] = useState<number>();
    const [found, setFound] = useState<number>();
    const [notFound, setNotFound] = useState<number>();
    const [forwarded, setForwarded] = useState<number>();
    const [cleared, setCleared] = useState<number>();
    const [totalReports, setTotalReports] = useState<number>();
    const [loading, setLoading] = useState(true);
    const [userTotals, setUserTotals] = useState<number>();
    const [studentTotals, setStudentTotals] = useState<number>();
    const [lecturerTotals, setLecturerTotals] = useState<number>();

    const session = useSession();
    const email = session.data?.user?.email!;
    const userType = session.data?.userType;
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
    }, [email]);

    useEffect(()=>{
        const handleFetchSchoolUserTotals = async() => {
            try{
                setLoading(true);
                const result = await fetchSchoolUsersTotals(email);
                setLecturerTotals(result?.lecturers);
                setStudentTotals(result?.students);
                setUserTotals(result?.totalUsers);
            }catch(error){
                console.error('Error fetching users', error);
            }
        };
        handleFetchSchoolUserTotals();
    },[email]);

    //Admin Logic
    const [adminPending, setAdminPending] = useState<number>();
    const [adminFound, setAdminFound] = useState<number>();
    const [adminNotFound, setAdminNotFound] = useState<number>();
    const [adminForInvestigation, setAdminForInvestigation] = useState<number>();
    const [adminTotalUsers, setAdminTotalUsers] = useState<number>();
    const [adminTotalStudents, setAdminTotalStudents] = useState<number>();
    const [adminTotalLecturers, setAdminTotalLecturers] = useState<number>();
    useEffect(() => {
        const handleFetchAdminTotals = async() => {
            try{
                setLoading(true);
                const result = await fetchAdminTotals();
                setAdminPending(result?.pendingTotals);
                setAdminFound(result?.markFoundTotals);
                setAdminNotFound(result?.notFoundTotals);
                setAdminForInvestigation(result?.forwardedTotals);
                setAdminTotalUsers(result?.totalUsers);
                setAdminTotalStudents(result?.totalStudents);
                setAdminTotalLecturers(result?.totalLecturers);
                setLoading(false);
            }catch(error){
                console.error('Error fetching admin totals', error);
            }
        }
        handleFetchAdminTotals();
    },[]);

    //Charts Logic
    const [reportData, setReportData] = useState<{ month: string; markFound: number; Pending: number; markNotFound: number; underInvestigation: number}[]>([]);

    useEffect(() => {
        const getData = async () => {
            const data = await fetchMissingReportsStats();

            const monthlyData = data?.reduce((acc, item) => {
                const month = new Date(item.createdAt).toLocaleString('default', { month: 'short' });
                if (!acc[month]) acc[month] = { month, markFound: 0, Pending: 0, markNotFound: 0, underInvestigation: 0 };
        
                if (item.reportStatus === 'MARK_FOUND') acc[month].markFound += item._count._all;
                else if (item.reportStatus === 'PENDING') acc[month].Pending += item._count._all;
                else if (item.reportStatus === 'MARK_NOT_FOUND') acc[month].markNotFound += item._count._all;
                else if (item.reportStatus === 'FOR_FURTHER_INVESTIGATION') acc[month].underInvestigation += item._count._all;
        
                return acc;
              }, {} as Record<string, { month: string; markFound: number; Pending: number; markNotFound: number; underInvestigation: number }>);
        
              if (monthlyData) {
                setReportData(Object.values(monthlyData));
              }
            };
        
            getData();
    }, []);

    if(loading) return <Loader/>;
  return (
    <div className='w-full h-full'>
        {userType === 'DEAN' && (
        <>
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
                        <h1>{userTotals}</h1>
                    </div>
                    <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
                    <h1>Total Students</h1>
                    <h1>{studentTotals}</h1>
                    </div>
                    <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
                        <h1>Total Lecturers</h1>
                        <h1>{lecturerTotals}</h1>
                    </div>
                </div>
            </div>
        </>
        )} 
        {userType === 'ADMIN' && (
        <>
            <Box className="p-6 bg-gray-100 min-h-screen">
            <Typography variant="h4" className="font-bold text-gray-800 mb-6">Admin Dashboard</Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3} className="mb-6">
                <StatCard title="Pending Missing Marks" count={adminPending ?? 0} icon={<ClockIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
                <StatCard title="Missing Mark Found" count={adminFound ?? 0} icon={<DocumentCheckIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
                <StatCard title="Missing Mark Not Found" count={adminNotFound ?? 0} icon={<DocumentCheckIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
                <StatCard title="Forwarded Missing Mark" count={adminForInvestigation ?? 0} icon={<PaperAirplaneIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
                <StatCard title="Total Users" count={adminTotalUsers ?? 0} icon={<CheckBadgeIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
                <StatCard title="Total Lecturers" count={adminTotalLecturers ?? 0} icon={<UserGroupIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
                <StatCard title="Total Students" count={adminTotalStudents ?? 0} icon={<AcademicCapIcon className='w-6 h-6 text-sky-300'/>} color="bg-sky-300" />
            </Grid>

            {/* Reports Bar Chart */}
            <div className='w-1/2'>
                <Paper className="p-4 shadow-lg">
                <Typography variant="h6" className="font-semibold mb-4">Report Statistics</Typography>
                <ResponsiveContainer width="100%" height={270}>
                <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="markFound" fill="#4caf50" />
                    <Bar dataKey="Pending" fill="#ffeb3b" />
                    <Bar dataKey="markNotFound" fill="#f44336" />
                    <Bar dataKey="underInvestigation" fill="#2196f3" />
                </BarChart>
                </ResponsiveContainer>
            </Paper>
            </div>
            </Box>
        </>
        )}
    </div>
  )
}

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, count, icon, color }: StatCardProps) {
    return (
      <Grid item xs={12} sm={6} md={3}>
        <Paper className={`p-4 rounded-lg flex items-center ${color} text-white shadow-lg`}>
          <div className="mr-4">{icon}</div>
          <div>
            <Typography variant="h6" className="font-semibold">{title}</Typography>
            <Typography variant="h4" className="font-bold">{count}</Typography>
          </div>
        </Paper>
      </Grid>
    );
  }