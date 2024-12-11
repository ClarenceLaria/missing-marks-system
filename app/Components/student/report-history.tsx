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

export function ReportHistory() {
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
                <TableCell className="font-medium">{report.course}</TableCell>
                <TableCell>{report.lecturer}</TableCell>
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