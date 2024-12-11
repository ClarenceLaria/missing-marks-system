"use client";

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

const departments = [
  {
    id: 1,
    name: "Information Technology",
    cod: "Dr. Jane Smith",
    students: 450,
    lecturers: 15,
  },
  {
    id: 2,
    name: "Computer Science",
    cod: "Prof. John Doe",
    students: 406,
    lecturers: 17,
  },
];

export function DepartmentList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments Overview</CardTitle>
        <CardDescription>A list of all departments in your school</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Head of Department</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Lecturers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell>{dept.cod}</TableCell>
                <TableCell>{dept.students}</TableCell>
                <TableCell>{dept.lecturers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}