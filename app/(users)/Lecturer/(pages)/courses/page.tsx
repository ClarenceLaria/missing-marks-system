"use client";
import { CourseList } from "@/app/Components/lecturer/course-list";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            A list of courses assigned to you
          </p>
        </div>
      </div>
        <CourseList />
    </div>
  );
}