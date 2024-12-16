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
import { useState } from "react";
import { BookOpen, PenSquare, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/app/Components/ui/badge";
import { CreateProgramDialog } from "../../Components/admin/create-program-dialog";

const courses = [
  {
    id: 1,
    name: "Bachelor of Science in Computer Science",
    school: "School of Computing",
    departments: ["Computer Science"],
  },
    {
        id: 2,
        name: "Bachelor of Information Technology",
        school: "School of Computing",
        departments: ["Information Technology"],
    },
    {
        id: 3,
        name: "Bachelor of Science in Software Engineering",
        school: "School of Computing",
        departments: ["Software Engineering"],
    },
    {
        id: 4,
        name: "Bachelor of Science in Computer Engineering",
        school: "School of Engineering",
        departments: ["Computer Engineering"],
    },
    {
        id: 5,
        name: "Bachelor of Science in Electrical Engineering",
        school: "School of Engineering",
        departments: ["Electrical Engineering"],
    },
    {
        id: 6,
        name: "Bachelor of Science in Mechanical Engineering",
        school: "School of Engineering",
        departments: ["Mechanical Engineering"],
    },
  
];

export default function CoursesPage() {
  const [createOpen, setCreateOpen] = useState(false);

  const handleOpen = () => {
    setCreateOpen((prev) => !prev);
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
        <Button onClick={() => handleOpen()}>
          <BookOpen className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
          <CardDescription>
            A list of all programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => {
                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
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
                      <div className="flex items-center gap-2">
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

      <CreateProgramDialog open={createOpen}/>
    </div>
  );
}