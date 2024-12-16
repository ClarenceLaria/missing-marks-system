"use client";

import { cn } from '@/app/lib/utils';
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
  Building2,
  FileSpreadsheet,
  GraduationCapIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = {
  ADMIN: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/Admin",
    },
    {
      title: "Schools",
      icon: School,
      href: "/Admin/schools",
    },
    {
      title: "Users",
      icon: Users,
      href: "/Admin/users",
    },
    {
      title: "Programs",
      icon: GraduationCapIcon,
      href: "/Admin/programs",
    },
    {
      title: "Courses",
      icon: BookOpen,
      href: "/Admin/courses",
    },
  ],
  DEAN: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dean",
    },
    {
      title: "Departments",
      icon: Building2,
      href: "/dean/departments",
    },
    {
      title: "Courses",
      icon: BookOpen,
      href: "/dean/courses",
    },
    {
      title: "Missing Marks",
      icon: FileSpreadsheet,
      href: "/dean/missing-marks",
    },
  ],
  COD: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/cod",
    },
    {
      title: "Departments",
      icon: Building2,
      href: "/cod/departments",
    },
    {
      title: "Courses",
      icon: BookOpen,
      href: "/cod/courses",
    },
    {
      title: "Missing Marks",
      icon: FileSpreadsheet,
      href: "/cod/missing-marks",
    },
  ],
  LECTURER: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/Lecturer",
    },
    {
      title: "My Courses",
      icon: BookOpen,
      href: "/Lecturer/courses",
    },
    {
      title: "Missing Marks",
      icon: FileSpreadsheet,
      href: "/Lecturer/missing-marks",
    },
  ],
  STUDENT: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/Student",
    },
    {
      title: "My Courses",
      icon: BookOpen,
      href: "/Student/courses",
    },
    {
      title: "Report Missing Mark",
      icon: FileSpreadsheet,
      href: "/Student/report",
    },
  ],
};

export function DashboardNav() {
  const pathname = usePathname();
  // This should be dynamic based on user role from auth context
  const userRole = pathname.includes("/Admin")
    ? "ADMIN"
    : pathname.includes("/dean")
    ? "DEAN"
    : pathname.includes("/cod")
    ? "COD"
    : pathname.includes("/Lecturer")
    ? "LECTURER"
    : "STUDENT";

  const currentRoutes = routes[userRole as keyof typeof routes];

  return (
    <nav className="w-64 border-r bg-card min-h-screen p-4 space-y-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <GraduationCap className="h-6 w-6" />
        <span className="font-semibold">Missing Mark System</span>
      </div>
      <div className="space-y-1">
        {currentRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === route.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}