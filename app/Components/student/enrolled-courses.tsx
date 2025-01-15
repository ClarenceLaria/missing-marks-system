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
import { fetchStudentUnits } from "@/app/lib/actions";
import { Semester } from "@prisma/client";
import { useEffect, useState } from "react";

const courses = [
  {
    id: 1,
    code: "BCS 203",
    name: "Database Systems",
    lecturer: "Dr. Jane Smith",
    year: "2023/2024",
  },
  {
    id: 2,
    code: "BCS 204",
    name: "Software Engineering",
    lecturer: "Prof. John Doe",
    year: "2023/2024",
  },
];

interface Unit{
  id: number;
  name: string;
  code: string;
  academicYear: string;
  yearOfStudy: number;
  semester: Semester;
  lecturerId: number;
  lecturer: {
    firstName: string;
    secondName: string;
  }
}
export function EnrolledCourses() {
  const [units, setUnits] = useState<Unit []>([]);

  useEffect(() => {
    const handleUnits = async () => {
      const units = await fetchStudentUnits();
      setUnits(units || []); 
    };
    handleUnits();
  },[]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Courses</CardTitle>
        <CardDescription>Your enrolled courses this semester</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Lecturer</TableHead>
              <TableHead>Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="font-medium">{unit.code}</TableCell>
                <TableCell>{unit.name}</TableCell>
                <TableCell>{unit.lecturer.firstName + " " + unit.lecturer.secondName}</TableCell>
                <TableCell>{unit.academicYear}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}