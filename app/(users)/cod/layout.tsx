import type { Metadata } from "next";
import SideNav from "./Components/SideBar";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/utils/authOptions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MMUST MISSING MARK SYSTEM",
  description: "Track your missing marks",
};

export default async function CodLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession(authOptions);
  const session = await getServerSession(authOptions);
  if (!session){
    redirect('/')
  }
  const userType =session?.userType

  // if(userType === 'STUDENT'){
    
  //   redirect('/Student/home')
  // }
  // if(userType === 'LECTURER'){
    
  //   redirect('/Lecturer')
  // }
  // if(userType === 'COD'){
    
  //   redirect('/cod')
  // }
  // if(userType === 'ADMIN' || userType === 'DEAN'){
    
  //   redirect('/Admin')
  // }  
  // if(userType === 'SUPERADMIN'){
    
  //   redirect('/SuperAdmin')
  // }
  return (
    <>
      <div className="w-screen h-screen flex flex-col overflow-hidden">
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
