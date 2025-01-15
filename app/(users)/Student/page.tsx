"use client";

import { Button } from "@/app/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/Components/ui/card";
import { EnrolledCourses } from "@/app/Components/student/enrolled-courses";
import { MissingMarksReport } from "@/app/Components/student/missing-marks-report";
import { ReportHistory } from "@/app/Components/student/report-history";
import { BookOpen, FileCheck, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchReportNumbers } from "@/app/lib/actions";
import { set } from "react-hook-form";
import Loader from "@/app/Components/Loader";

export default function StudentDashboard() {
  const [unitTotals, setUnitTotals] = useState(Number);
  const [pendingTotals, setPendingTotals] = useState(Number);
  const [markFoundTotals, setMarkFoundTotals] = useState(Number);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleTotals = async () => {
      setLoading(true);
      const totals = await fetchReportNumbers();
      setUnitTotals(totals.unitTotals);
      setPendingTotals(totals.pendingTotals);
      setMarkFoundTotals(totals.markFoundTotals);
      setLoading(false);
    }
    handleTotals();
  },[]);
  if (loading) return <Loader />
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unitTotals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTotals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Reports</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{markFoundTotals}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <EnrolledCourses />
        <MissingMarksReport />
      </div>
      <ReportHistory />
    </div>
  );
}