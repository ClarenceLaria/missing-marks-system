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
import { useEffect, useState } from "react";
import { School, PenSquare, Trash2 } from "lucide-react";
import { CreateSchoolDialog } from "@/app/(users)/Admin/Components/admin/create-school-dialog";
import { fetchSchoolDetails, fetchSchools } from "@/app/lib/actions";
import { DeleteSchoolDialog } from "../../Components/admin/delete-school-dialog";

const schools = [
  {
    id: 1,
    name: "School of Computing and Informatics",
    dean: "Prof. John Doe",
    departments: 4,
    students: 850,
    lecturers: 32,
  },
  {
    id: 2,
    name: "School of Engineering",
    dean: "Dr. Jane Smith",
    departments: 6,
    students: 1200,
    lecturers: 45,
  },
];

interface Schools {
  id: number;
  name: string;
  totalDepartments: number;
  totalStudents: number;
  totalLecturers: number;
  deans: any[];
}
export default function SchoolsPage() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [schools, setSchools] = useState<Schools[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  }

  const handleOpenDelete = () => {
    setOpenDelete((prev) => !prev);
  }

  useEffect(() => {
    const handleSchools = async () => {
      try{
        const schools = await fetchSchoolDetails();
        setSchools(schools);
      }catch(error){
        console.error('Error fetching schools: ',error);
      }
    }
    handleSchools();
  },[]);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Schools</h2>
          <p className="text-muted-foreground">
            Manage university schools and their deans
          </p>
        </div>
        <Button onClick={() => handleOpen()}>
          <School className="mr-2 h-4 w-4" />
          Add School
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Schools</CardTitle>
          <CardDescription>A list of all schools in the university</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead>Dean</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Lecturers</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.deans.map((dean) => (dean.firstName + ' ' + dean.secondName))}</TableCell>
                  <TableCell>{school.totalDepartments}</TableCell>
                  <TableCell>{school.totalStudents}</TableCell>
                  <TableCell>{school.totalLecturers}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {setId(school.id); handleOpenDelete(); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateSchoolDialog open={open} /*onOpenChange={setOpen}*/ />
      <DeleteSchoolDialog id={id} open={openDelete}/>
    </div>
  );
}