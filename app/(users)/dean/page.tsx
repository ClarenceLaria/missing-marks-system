"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/Components/ui/card";
import { DepartmentList } from "@/app/Components/dean/department-list";
import { MissingMarksOverview } from "@/app/Components/dean/missing-marks-overview";
import { SchoolStats } from "@/app/Components/dean/school-stats";
import { Building2, GraduationCap, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchSchoolTotals, fetchSchoolUsersTotals } from "@/app/lib/actions";

export default function DeanDashboard() {
  const [lecturers, setLecturers] = useState(Number);
  const [students, setStudents] = useState(Number);
  const [departments, setDepartments] = useState(Number);

  const session = useSession();
  const email = session.data?.user?.email!;
  useEffect(() => {
    const handleUserTotals = async () => {
      try{
        const totals = await fetchSchoolUsersTotals(email);
        if (totals) {
          setLecturers(totals.lecturers || 0);
          setStudents(totals.students || 0);
        }
      }catch(error){
        console.error("Error fetching user totals: ", error);
      }
    };
    handleUserTotals();
  },[email]);

  useEffect(() => {
    const handleDepartments = async () => {
      try{
        const response = await fetchSchoolTotals(email);
        if (response) {
          setDepartments(response.totalDepartments || 0);
        }
      }catch(error){
        console.error("Error fetching departments: ", error);
      }
    };
    handleDepartments();
  },[email]);
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">School Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">School Lecturers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lecturers}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <MissingMarksOverview />
        <SchoolStats />
      </div>
      <DepartmentList />
    </div>
  );
}