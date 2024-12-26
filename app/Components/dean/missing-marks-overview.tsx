"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/Components/ui/card";
import { fetchSchoolReportStatistics } from "@/app/lib/actions";
import { ReportStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "Pending", value: 12 },
  { name: "Missing", value: 8 },
  { name: "Resolved", value: 24 },
];

interface ReportStatistics {
  status: ReportStatus;
    count: number;
}
export function MissingMarksOverview() {
  const [reportData, setReportData] = useState<{reportStatus:ReportStatus; count:number;}[]>([]);

  useEffect(() => {
    const handleStats = async () => {
      try{
        const data = await fetchSchoolReportStatistics();
        setReportData(data || [])
      }catch(error){
        console.error("Error fetching Statistics: ", error)
      }
    };
    handleStats();
  },[])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Marks Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData}>
            <XAxis dataKey="status" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Bar dataKey="count" fill="currentColor" className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}