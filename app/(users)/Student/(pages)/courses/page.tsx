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
export default function Page() {
  const [units, setUnits] = useState<Unit []>([]);

  useEffect(() => {
    const handleUnits = async () => {
      const units = await fetchStudentUnits();
      setUnits(units?.units || []); 
    };
    handleUnits();
  },[]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Courses</CardTitle>
        <CardDescription>A list of all your courses</CardDescription>
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
            {units.length > 0 ?
            units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="font-medium">{unit.code}</TableCell>
                <TableCell>{unit.name}</TableCell>
                <TableCell>{unit.lecturer.firstName + " " + unit.lecturer.secondName}</TableCell>
                <TableCell>{unit.academicYear}</TableCell>
              </TableRow>
            )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No courses found for this semester</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}