import Image from "next/image";
import AuthForm from "./Components/AuthForm";
import Students from '@/public/images/graduation.jpg'
import Logo from '@/public/images/logo.png'
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "./Components/ThemeToggle";

export default function Home() {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="absolute top-0 right-0 border-2 border-gray-100 rounded-lg m-4 ">
          <ThemeToggle/>
        </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 px-2 mx-auto pt-1">
              <GraduationCap className="h-6 w-6" />
              <span className="font-semibold">Missing Mark System</span>
            </div>
            <div className="">
              <AuthForm></AuthForm>
            </div>
          </div>
      </div>
    </>
  );
}
