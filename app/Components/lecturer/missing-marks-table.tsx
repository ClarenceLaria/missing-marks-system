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

const reports = [
  {
    id: 1,
    student: "John Doe",
    admissionNo: "SCT221-0001/2022",
    course: "BCS 203",
    status: "pending",
    reportedAt: "2024-03-20",
  },
  {
    id: 2,
    student: "Jane Smith",
    admissionNo: "SCT221-0015/2022",
    course: "BIT 301",
    status: "resolved",
    reportedAt: "2024-03-18",
  },
];

export function MissingMarksTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Marks Reports</CardTitle>
        <CardDescription>Recent missing marks reports from students</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Admission No</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.student}</TableCell>
                <TableCell>{report.admissionNo}</TableCell>
                <TableCell>{report.course}</TableCell>
                <TableCell>
                  <Badge
                    variant={report.status === "pending" ? "secondary" : "success"}
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{report.reportedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}