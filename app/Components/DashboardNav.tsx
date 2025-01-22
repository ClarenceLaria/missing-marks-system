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
  XIcon,
  MenuIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from 'react';

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
      title: "Lecturers",
      icon: Users,
      href: "/dean/lecturers",
    },
    {
      title: "Students",
      icon: GraduationCapIcon,
      href: "/dean/students",
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
      title: "Lecturers",
      icon: Users,
      href: "/cod/lecturers",
    },
    {
      title: "Students",
      icon: GraduationCapIcon,
      href: "/cod/students",
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
      title: "My Missing Mark",
      icon: FileSpreadsheet,
      href: "/Student/reported",
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

  const [isOpen, setIsOpen] = useState(false);
  const toggleNav = () => {
    setIsOpen((prev) => !prev);
  };
  const toggleOffNav = () => {
    setIsOpen(!toggleNav);
  };
  return (
    <div>
      <nav className="hidden md:block w-64 border-r bg-card min-h-screen p-4 space-y-4">
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
      {/* For mobile view */}
      <nav className={cn('md:hidden w-full top-0 left-0 absolute', isOpen && 'h-full bg-card z-50')}>
        <div className='flex items-center justify- mb-8 p-4'>
          <div>
            <XIcon className={cn("h-6 w-6 ", !isOpen && 'hidden')} onClick={toggleNav}/>
            <MenuIcon className={cn("h-6 w-6 ", isOpen && 'hidden')} onClick={toggleNav}/>
          </div>
          <div className="flex items-center gap-2 px-2 mx-auto pt-1">
            <GraduationCap className="h-6 w-6" />
            <span className="font-semibold">Missing Mark System</span>
          </div>
        </div>
        <div className={cn('w-full h-full bg-card z-50', !isOpen && 'hidden')}>
          <div className='w-3/4 mx-auto '>
            {currentRoutes.map((route) => (
              <Link
                onClick={toggleOffNav}
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center my-5 gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
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
        </div>
      </nav>
    </div>
  );
}