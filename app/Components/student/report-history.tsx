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
import { fetchMissingReports } from "@/app/lib/actions";
import { ExamType, ReportStatus, Semester } from "@prisma/client";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

const reports = [
  {
    id: 1,
    course: "BCS 203",
    lecturer: "Dr. Jane Smith",
    status: "pending",
    reportedAt: "2024-03-20",
  },
  {
    id: 2,
    course: "BCS 204",
    lecturer: "Prof. John Doe",
    status: "resolved",
    reportedAt: "2024-03-15",
  },
];

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
export function ReportHistory() {
  const [reports, setReports] = useState<missingReport []>([]);

  useEffect(() => {
    const handleReports = async () => {
      try{
        const reports = await fetchMissingReports();
        setReports(reports || []);
      }catch(error){
        console.error("Error fetching reports: ",error)
      }
    };
    handleReports();
  },[]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Marks History</CardTitle>
        <CardDescription>Your reported missing marks and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Lecturer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.unitCode}</TableCell>
                <TableCell>{report.lecturerName}</TableCell>
                <TableCell>
                  <Badge
                    variant={report.reportStatus === ReportStatus.PENDING ? "destructive" : "success"}
                  >
                    {report.reportStatus}
                  </Badge>
                </TableCell>
                <TableCell>{report.createdAt.toDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}