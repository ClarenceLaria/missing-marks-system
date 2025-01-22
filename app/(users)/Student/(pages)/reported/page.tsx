'use client'
"use client";

import { Badge } from "@/app/Components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/Components/ui/table";
import React, {Suspense, useEffect, useState} from 'react'
import Search from '../../Components/Search'
// import Card from '../../Components/Card'
// import Table from '../../Components/Table'
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
    reportStatus: report.reportStatus,
    lecturerName: report.lecturerName
  }));
  
  const filteredReports = transformedReports.filter(
    (report) => {
      const matchesSearchTerm =
      !searchTerm ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportStatus.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = 
      !searchDate || report.date.toDateString() === searchDate.toDateString();

      return matchesSearchTerm && matchesDate;
  });
  return (
    <div className='space-y-8'>
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
          {/* <Table reports={filteredReports} ></Table> */}
          <Card>
            <CardHeader>
              <CardTitle>Missing Marks History</CardTitle>
              <CardDescription>Your reported missing marks and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Lecturer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ?
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell className="font-medium">{report.unitCode}</TableCell>
                      <TableCell>{report.lecturerName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={report.reportStatus === ReportStatus.PENDING ? "destructive" : "success"}
                        >
                          {report.reportStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.date.toDateString()}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No reports found</TableCell>
                    </TableRow>
                  )
                }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Suspense>
       
    </div>
  )
}
