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
import { fetchSchoolDepartmentsOverview } from "@/app/lib/actions";
import { useEffect, useState } from "react";

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

interface Department{
  id: number;
  name: string;
  totalStudents: number;
  totalLecturers: number;
  cod: {
      id: number;
      firstName: string;
      secondName: string;
      email: string;
  } | null
}
export function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const handleDepartments = async () => {
      try{
        const data = await fetchSchoolDepartmentsOverview();
        setDepartments(data);
      }catch(error){
        console.error("Error fetching Departments: ", error);
      }
    };
    handleDepartments();
  },[])
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
                <TableCell>{dept.cod?.firstName+ " " + dept.cod?.secondName}</TableCell>
                <TableCell>{dept.totalLecturers}</TableCell>
                <TableCell>{dept.totalLecturers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}