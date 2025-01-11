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
import { fetchLecturerUnits } from "@/app/lib/actions";
import { Semester } from "@prisma/client";
import { useEffect, useState } from "react";

const courses = [
  {
    id: 1,
    code: "BCS 203",
    name: "Database Systems",
    year: "2023/2024",
    students: 120,
  },
  {
    id: 2,
    code: "BIT 301",
    name: "Web Development",
    year: "2023/2024",
    students: 85,
  },
];

interface Course {
  id: number;
  name: string;
  code: string;
  year: string;
  totalStudents: number;
}
export function CourseList() {
  const [courses, setCourses] = useState<Course []>([]);

  useEffect(() => {
    const handleCourses = async () => {
      try{
        const courses = await fetchLecturerUnits();
        setCourses(courses?.unitDetails || []);
      }catch(error){
        console.error("Error fetching Courses: ", error);
      }
    };
    handleCourses();
  },[]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Courses</CardTitle>
        <CardDescription>
          Courses you are teaching in the current academic year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead>Enrolled Students</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.year}</TableCell>
                  <TableCell>{course.totalStudents}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  You have no assigned courses
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}