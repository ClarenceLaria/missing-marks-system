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

export function CourseList() {
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
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.code}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.year}</TableCell>
                <TableCell>{course.students}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}