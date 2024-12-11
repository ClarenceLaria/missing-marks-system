import type { Metadata } from "next";
import SideNav from "./Components/SideBar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/utils/authOptions";
import NavBar from "@/app/Components/NavBar";
import clsx from "clsx";
import { DashboardNav } from "@/app/Components/DashboardNav";
import { ThemeToggle } from "@/app/Components/ThemeToggle";
import { UserNav } from "@/app/Components/user-nav";
import { ThemeProvider } from "@/app/Components/ThemeProvider";

export const metadata: Metadata = {
  title: "MMUST Missing Marks System",
  description: "A comprehensive system for tracking, reporting, and managing missing marks at Masinde Muliro University of Science and Technology (MMUST). Facilitates efficient communication and resolution for academic records.",
};

export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session){
    redirect('/')
  }
  const userType =session?.userType
  if (userType === 'STUDENT') {
    redirect('/Student/home');
  } else if (userType === 'COD') {
    redirect('/cod');
  } else if (userType === 'ADMIN' || userType === 'DEAN') {
    redirect('/Admin');
  } else if (userType === 'SUPERADMIN') {
    redirect('/SuperAdmin');
  }
  return (
    <>
      {/* <div className="w-screen h-screen flex flex-col overflow-hidden">
          <div className={clsx(`w-full bg-gray-200 shadow-md h-[10vh]`)}>
              <NavBar></NavBar>
          </div>
          <div className="flex flex-row">
            <div className="h-screen px-4 w-[15vw] bg-sky-400">
              <SideNav></SideNav>
            </div>
            <div className="w-full h-full">{children}</div>
          </div>
      </div> */}
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
      <div className="min-h-screen flex">
      <DashboardNav />
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
    </ThemeProvider>
    </>
  );
}
