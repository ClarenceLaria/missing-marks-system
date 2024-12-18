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
import { useEffect, useState } from "react";
import { BookOpen, PenSquare, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/app/Components/ui/badge";
import { fetchUnitsForAdmin } from "@/app/lib/actions";

// const courses = [
//   {
//     id: 1,
//     code: "BCS 203",
//     name: "Database Systems",
//     school: "School of Computing",
//     departments: ["IT", "Computer Science"],
//     assignments: [
//       {
//         academicYear: "2023/2024",
//         lecturer: "Dr. Jane Smith",
//         students: 120,
//       },
//       {
//         academicYear: "2022/2023",
//         lecturer: "Prof. John Doe",
//         students: 98,
//       },
//     ],
//   },
//   {
//     id: 2,
//     code: "BIT 301",
//     name: "Web Development",
//     school: "School of Computing",
//     departments: ["IT"],
//     assignments: [
//       {
//         academicYear: "2023/2024",
//         lecturer: "Dr. Alice Johnson",
//         students: 85,
//       },
//     ],
//   },
// ];

interface Course {
  unitId: number;
  unitName: string;
  unitCode: string;
  academicYear: string;
  schoolName: string | null;
  courses: string[];
  lecturer: string;
  totalStudents: number;
}
export default function CoursesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    code: string;
    name: string;
  } | null>(null);

  const handleOpen = () => {
    setCreateOpen((prev) => !prev);
  };

  const handleAssign = (course: typeof courses[0]) => {
    const selectedCourse = {
      id: course.unitId,      // Map unitId to id
      code: course.unitCode,  // Map unitCode to code
      name: course.unitName,  // Map unitName to name
    };
    setSelectedCourse(selectedCourse);
    setAssignOpen(true);
  };

  useEffect(() => {
    const handleCourses = async () => {
      try{
        const units = await fetchUnitsForAdmin();
        setCourses(units || []);
      }catch(error){
        console.error("Error fetching courses: ", error);
      }
    };
    handleCourses();
  },[]);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            Manage university courses and their assignments
          </p>
        </div>
        <Button onClick={() => handleOpen()}>
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
                // const currentAssignment = course.assignments[0];
                return (
                  <TableRow key={course.unitId}>
                    <TableCell className="font-medium">{course.unitCode}</TableCell>
                    <TableCell>{course.unitName}</TableCell>
                    <TableCell>{course.schoolName}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {course.courses.map((course) => (
                          <Badge key={course} variant="secondary">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.lecturer ? (
                        <div className="text-sm">
                          <p className="font-medium">
                            {course.lecturer}
                          </p>
                          <p className="text-muted-foreground">
                            {course.academicYear} •{" "}
                            {course.totalStudents} students
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