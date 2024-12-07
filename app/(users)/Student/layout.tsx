import type { Metadata } from "next";
import SideNav from "./Components/SideBar";
import NavBar from "@/app/Components/NavBar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/utils/authOptions";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "MMUST Missing Marks System",
  description: "A comprehensive system for tracking, reporting, and managing missing marks at Masinde Muliro University of Science and Technology (MMUST). Facilitates efficient communication and resolution for academic records.",
  icons: {
    icon: [
      {
        url: '/images/icon.jpg',
        href: '/images/icon.jpg',
      }
    ],
  },
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
  if (userType === 'LECTURER') {
    redirect('/Lecturer');
  } else if (userType === 'COD') {
    redirect('/cod');
  } else if (userType === 'ADMIN' || userType === 'DEAN') {
    redirect('/Admin');
  } else if (userType === 'SUPERADMIN') {
    redirect('/SuperAdmin');
  }
  return (
    <>
      <div className="w-screen h-screen flex flex-col overflow-hidden">
          <div className={clsx(`w-full bg-gray-200 shadow-md h-[10vh]`)}>
              <NavBar></NavBar>
          </div>
          <div className="flex flex-row">
            <div className="h-screen px-4 w-[15vw] bg-sky-400">
              <SideNav></SideNav>
            </div>
            <div className="w-full h-full">{children}</div>
          </div>
      </div>
    </>
  );
}
