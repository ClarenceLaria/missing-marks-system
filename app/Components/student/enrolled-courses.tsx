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

export function EnrolledCourses() {
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
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.code}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.lecturer}</TableCell>
                <TableCell>{course.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}