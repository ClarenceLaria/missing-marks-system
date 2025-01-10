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
import { Suspense, useEffect, useState } from "react";
import { BookOpen, PenSquare, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/app/Components/ui/badge";
import { fetchUnitsForCod } from "@/app/lib/actions";
import Loader from "@/app/Components/Loader";
import Search from '@/app/(users)/Student/Components/Search'

const Loading = () => <div>Loading...</div>;
interface Course {
  unitId: number;
  unitName: string;
  unitCode: string;
  academicYear: string;
  courses: string[];
  lecturer: string;
  totalStudents: number;
}
export default function CoursesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);    
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    code: string;
    name: string;
    academicYear: string;
  } | null>(null);

  const handleOpen = () => {
    setCreateOpen((prev) => !prev);
  };

  const handleAssign = (course: Course) => {
    const selectedCourse = {
      id: course.unitId,      // Map unitId to id
      code: course.unitCode,  // Map unitCode to code
      name: course.unitName,  // Map unitName to name
      academicYear: course.academicYear,
    };
    setSelectedCourse(selectedCourse);
    setAssignOpen(true);
  };

  useEffect(() => {
    const handleCourses = async () => {
      try{
        setLoading(true);
        const units = await fetchUnitsForCod();
        setCourses(units || []);
        setLoading(false);
      }catch(error){
        console.error("Error fetching courses: ", error);
      }
    };
    handleCourses();
  },[]);

  if(loading) return <Loader/>

    const filteredReports = courses.filter(
        (course) => {
        const matchesSearchTerm =
        !searchTerm ||
        course.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.lecturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.academicYear.toLowerCase().includes(searchTerm.toLowerCase())||
        course.courses.some((course) => course.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearchTerm;
    });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            Manage Department courses and their assignments
          </p>
        </div>
        <div>
            <Suspense fallback={<Loading/>}>
                <Search 
                placeholder='Search for a Course...'
                onSearch = {(term) => {
                    setSearchTerm(term);
                }}
                ></Search>            
            </Suspense>
        </div>
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
                <TableHead>Departments</TableHead>
                <TableHead>Current Assignment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((course) => {
                return (
                  <TableRow key={course.unitId}>
                    <TableCell className="font-medium">{course.unitCode}</TableCell>
                    <TableCell>{course.unitName}</TableCell>
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

      <CreateCourseDialog open={createOpen}/>
      <AssignCourseDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        course={selectedCourse}
      />
    </div>
  );
}