"use client";

import { Button } from "@/app/Components/ui/button";
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
import { CreateCourseDialog } from "@/app/(users)/Admin/Components/admin/create-course-dialog";
import { AssignCourseDialog } from "@/app/(users)/Admin/Components/admin/assign-course-dialog";
import { useState } from "react";
import { BookOpen, PenSquare, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/app/Components/ui/badge";

const courses = [
  {
    id: 1,
    code: "BCS 203",
    name: "Database Systems",
    school: "School of Computing",
    departments: ["IT", "Computer Science"],
    assignments: [
      {
        academicYear: "2023/2024",
        lecturer: "Dr. Jane Smith",
        students: 120,
      },
      {
        academicYear: "2022/2023",
        lecturer: "Prof. John Doe",
        students: 98,
      },
    ],
  },
  {
    id: 2,
    code: "BIT 301",
    name: "Web Development",
    school: "School of Computing",
    departments: ["IT"],
    assignments: [
      {
        academicYear: "2023/2024",
        lecturer: "Dr. Alice Johnson",
        students: 85,
      },
    ],
  },
];

export default function CoursesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(
    null
  );

  const handleAssign = (course: typeof courses[0]) => {
    setSelectedCourse(course);
    setAssignOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            Manage university courses and their assignments
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <BookOpen className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>
            A list of all courses and their assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead>Current Assignment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => {
                const currentAssignment = course.assignments[0];
                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.school}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {course.departments.map((dept) => (
                          <Badge key={dept} variant="secondary">
                            {dept}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {currentAssignment ? (
                        <div className="text-sm">
                          <p className="font-medium">
                            {currentAssignment.lecturer}
                          </p>
                          <p className="text-muted-foreground">
                            {currentAssignment.academicYear} •{" "}
                            {currentAssignment.students} students
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Not assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAssign(course)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <PenSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateCourseDialog open={createOpen} /*onOpenChange={setCreateOpen}*/ />
      <AssignCourseDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        course={selectedCourse}
      />
    </div>
  );
}