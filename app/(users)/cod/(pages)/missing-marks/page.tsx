'use client'
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
import { Button } from "@/app/Components/ui/button";
import { Trash2, EyeIcon } from "lucide-react";
import React,{Suspense, useEffect, useState} from 'react'
import Search from '@/app/(users)/Student/Components/Search'
import { fetchDepartmentReports } from '@/app/lib/actions';
import { ExamType, ReportStatus, Semester } from '@prisma/client';
import Loader from '@/app/Components/Loader';

const Loading = () => <div>Loading...</div>;
interface MissingReport {
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
    student: {
        firstName: string;
        secondName: string;
        regNo: string;
    };
}
export default function Page() {
    const [reports, setReport] = useState<MissingReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [searchDate, setSearchDate] = useState<Date | null>(null);
    const [openDelete, setOpenDelete] = useState(false);


    useEffect(() => {
        const handleReports = async () => {
            try{
                setLoading(true);
                const reports = await fetchDepartmentReports();
                setReport(reports?.allReports || []);
                setLoading(false);
            }catch(error){
                console.error('Error fetching reports:', error)
            }
        };
        handleReports();
    },[])

    const handleOpenDelete = () => {
        setOpenDelete((prev) => !prev);
    }

    const transformedReports = reports.map(report => ({
        id: report.id,
        name: `${report.student.firstName} ${report.student.secondName}`,
        regNo: report.student.regNo,
        title: report.unitName,
        unitCode: report.unitCode,
        date: report.createdAt,
        status: report.reportStatus,
      }));
    
      if(loading) return <Loader/>;
    
      const filteredReports = transformedReports.filter(
        (report) => {
          const matchesSearchTerm =
          !searchTerm ||
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.unitCode.toLowerCase().includes(searchTerm.toLowerCase());
    
          const matchesDate = 
          !searchDate || report.date.toDateString() === searchDate.toDateString();
    
          return matchesSearchTerm && matchesDate;
      });
  return (
    <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Department</h2>
        <p className="text-muted-foreground">
          Manage Department reports
        </p>
      </div>
      <div>
        <Suspense fallback={<Loading/>}>
          <Search 
          placeholder='Search for a Report...'
          onSearch = {(term) => {
              setSearchTerm(term);
          }}
          ></Search>            
        </Suspense>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
        <CardDescription>A list of all department reports</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student&apos;s Name</TableHead>
              <TableHead>Student&apos;s RegNo</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell className="font-medium">{report.regNo}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.unitCode}</TableCell>
                  <TableCell>{report.date.toDateString()}</TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {handleOpenDelete(); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center ">
                There are no reports here!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
  )
}
