import type { Metadata } from "next";
import SideNav from "./Components/SideBar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
