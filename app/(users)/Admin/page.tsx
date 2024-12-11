'use client'
import Loader from '@/app/Components/Loader';
import { fetchAdminTotals, fetchMissingReportsStats, fetchSchoolAbbreviations, fetchSchoolReportStatistics, fetchSchoolTotals, fetchSchoolUsersTotals } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Paper, CircularProgress } from '@mui/material';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UsersIcon, ClockIcon, DocumentCheckIcon, PaperAirplaneIcon, UserGroupIcon, AcademicCapIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

import { Card, CardContent, CardHeader, CardTitle } from "@/app/Components/ui/card";
import { School, Users, GraduationCap, BookOpen } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    total: 12,
  },
  {
    name: "Feb",
    total: 15,
  },
  // Add more data points
];

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
    const [adminTotalStudents, setAdminTotalStudents] = useState<number>();
    const [adminTotalLecturers, setAdminTotalLecturers] = useState<number>();
    const [adminTotalSchools, setAdminTotalSchools] = useState<number>();
    const [adminTotalCourses, setAdminTotalCourses] = useState<number>();
    useEffect(() => {
        const handleFetchAdminTotals = async() => {
            try{
                setLoading(true);
                const result = await fetchAdminTotals();
                setAdminTotalStudents(result?.totalStudents);
                setAdminTotalLecturers(result?.totalLecturers);
                setAdminTotalSchools(result?.totalSchools);
                setAdminTotalCourses(result?.totalCourses);
                setLoading(false);
            }catch(error){
                console.error('Error fetching admin totals', error);
            }
        }
        handleFetchAdminTotals();
    },[]);

    //Charts Logic
    const [reportData, setReportData] = useState<{ month: string; missingMarks: number;}[]>([]);

    useEffect(() => {
        const getData = async () => {
          const data = await fetchMissingReportsStats();
          if (data) {
            setReportData(data);
          }
        }
            getData();
    }, []);
    
    // Abbreviations Logic
    const [abbreviations, setAbbreviations] = useState<{ abbreviation: string }[]>();

    useEffect(() => {
            const handleFetchAbbreviations = async () => {
                try{
                    setLoading(true);
                    const result = await fetchSchoolAbbreviations();
                    setAbbreviations(result);
                    setLoading(false);
                }catch(error){
                    console.error('Error fetching abbreviations', error);
                }
            }
            handleFetchAbbreviations();
        },[]);

    if(loading) return <Loader/>;
  return (
    // <div className='w-full h-full'>
    //     {userType === 'DEAN' && (
    //     <>
    //         <div>
    //             <h1 className='text-2xl font-bold pt-10 px-10 text-center'>Missing Marks Report</h1>
    //             <div className='w-full py-5 flex flex-row justify-evenly'>
    //                 <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
    //                 <h1>Total Missing Marks</h1>
    //                 <h1>{totalReports}</h1>
    //                 </div>
    //                 <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                     <h1>Pending Missing Marks</h1>
    //                     <h1>{pending}</h1>
    //                 </div>
    //                 <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                     <h1>Missing Marks Found</h1>
    //                     <h1>{found}</h1>
    //                 </div>
    //                 <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                     <h1>Missing Marks Not Found</h1>
    //                     <h1>{notFound}</h1>
    //                 </div>
    //                 <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                     <h1>Forwarded Missing Marks</h1>
    //                     <h1>{forwarded}</h1>
    //                 </div>
    //                 <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                     <h1>Cleared Missing Marks</h1>
    //                     <h1>{cleared}</h1>
    //                 </div>
    //             </div>
    //         </div>
    //         <div>
    //             <h1 className='text-2xl font-bold pt-10 px-10 text-center'>Users</h1>
    //             <div className='w-full py-5 flex flex-row justify-evenly'>
    //                 <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                     <h1>Total Users</h1>
    //                     <h1>{userTotals}</h1>
    //                 </div>
    //                 <div className='w-44 h-44 rounded-lg  text-center shadow-lg flex flex-col justify-center items-center'>
    //                 <h1>Total Students</h1>
    //                 <h1>{studentTotals}</h1>
    //                 </div>
    //                 <div className='w-44 h-44 rounded-lg text-center shadow-lg flex flex-col justify-center items-center'>
    //                     <h1>Total Lecturers</h1>
    //                     <h1>{lecturerTotals}</h1>
    //                 </div>
    //             </div>
    //         </div>
    //     </>
    //     )} 
    //     {userType === 'ADMIN' && (
    //     <>
    //         <Box className="p-6 bg-gray-100 min-h-screen">
    //         <Typography variant="h4" className="font-bold text-gray-800 mb-6">Admin Dashboard</Typography>

    //         {/* Statistics Cards */}
    //         <Grid container spacing={3} className="mb-6">
    //             <StatCard title="Pending Missing Marks" count={adminPending ?? 0} icon={<ClockIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
    //             <StatCard title="Missing Mark Found" count={adminFound ?? 0} icon={<DocumentCheckIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
    //             <StatCard title="Missing Mark Not Found" count={adminNotFound ?? 0} icon={<DocumentCheckIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
    //             <StatCard title="Forwarded Missing Mark" count={adminForInvestigation ?? 0} icon={<PaperAirplaneIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
    //             <StatCard title="Total Users" count={adminTotalUsers ?? 0} icon={<CheckBadgeIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
    //             <StatCard title="Total Lecturers" count={adminTotalLecturers ?? 0} icon={<UserGroupIcon className='w-6 h-6 text-sky-300' />} color="bg-sky-300" />
    //             <StatCard title="Total Students" count={adminTotalStudents ?? 0} icon={<AcademicCapIcon className='w-6 h-6 text-sky-300'/>} color="bg-sky-300" />
    //         </Grid>

    //         {/* Reports Bar Chart */}
    //         <div className='flex gap-4'>
    //             <div className='w-1/2'>
    //                 <Paper className="p-4 shadow-lg">
    //                 <Typography variant="h6" className="font-semibold mb-4">University Report Statistics</Typography>
    //                 <ResponsiveContainer width="100%" height={270}>
    //                 <BarChart data={reportData}>
    //                     <CartesianGrid strokeDasharray="3 3" />
    //                     <XAxis dataKey="month" />
    //                     <YAxis />
    //                     <Tooltip />
    //                     <Bar dataKey="markFound" fill="#4caf50" />
    //                     <Bar dataKey="Pending" fill="#ffeb3b" />
    //                     <Bar dataKey="markNotFound" fill="#f44336" />
    //                     <Bar dataKey="underInvestigation" fill="#2196f3" />
    //                 </BarChart>
    //                 </ResponsiveContainer>
    //             </Paper>
    //             </div>
    //             <div className='w-1/2'>
    //                 <Paper className="p-4 shadow-lg">
    //                 <div className='flex justify-between'>
    //                     <Typography variant="h6" className="font-semibold mb-4">School&apos;s Report Statistics</Typography>
    //                     <div>
    //                         <label htmlFor="">Select a school:</label>
    //                         <select className="p-2 rounded-lg border border-gray-300 mb-4"
    //                             value={abbr}
    //                             onChange={(e) => setAbbr(e.target.value)}
    //                         >
    //                             <option value="all">All Schools</option>
    //                             {abbreviations?.map((abbr, index) => (
    //                                 <option key={index} value={abbr.abbreviation}>{abbr.abbreviation}</option>
    //                             ))}
    //                         </select>
    //                     </div>
    //                 </div>
    //                 <ResponsiveContainer width="100%" height={270}>
    //                 <BarChart data={schoolData}>
    //                     <CartesianGrid strokeDasharray="3 3" />
    //                     <XAxis dataKey="month" />
    //                     <YAxis />
    //                     <Tooltip />
    //                     <Bar dataKey="markFound" fill="#4caf50" />
    //                     <Bar dataKey="Pending" fill="#ffeb3b" />
    //                     <Bar dataKey="markNotFound" fill="#f44336" />
    //                     <Bar dataKey="underInvestigation" fill="#2196f3" />
    //                 </BarChart>
    //                 </ResponsiveContainer>
    //             </Paper>
    //             </div>
    //         </div>
    //         </Box>
    //     </>
    //     )}
    // </div>
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminTotalSchools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminTotalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminTotalLecturers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminTotalCourses}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Missing Marks Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={reportData}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip  
                contentStyle={{
                  color: '#0070f3', 
                  fontSize: '14px',
                }}
              // formatter={(value, name) => [`${value}`, name]}
              />
              <Bar
                dataKey="missingMarks"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
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