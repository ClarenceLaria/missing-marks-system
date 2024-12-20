"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/Components/ui/avatar";
import { Button } from "@/app/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/Components/ui/dropdown-menu";
import { fetchStaffProfile } from "@/app/lib/actions";
import { UserType } from "@prisma/client";
import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StaffProfile {
  id: number;
  createdAt: Date;
  email: string;
  firstName: string;
  secondName: string;
  phoneNumber: string;
  password: string;
  userType: UserType;
  departmentId: number;
}
export function UserNav() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const session = useSession();
  const email = session.data?.user?.email!;

  useEffect(() => {
    const handleProfile = async () => {
      try{
        const profile = await fetchStaffProfile();
        setProfile(profile);
      }catch(error){
        console.error('Error fetching user profile:',error);
      }
    }
    handleProfile();
  },[email]);
  const name = profile?.firstName + " " + profile?.secondName;
  const avatar = ((profile?.firstName?.substring(0, 1) ?? '') + (profile?.secondName?.substring(0, 1) ?? '')).toUpperCase();

  // const { data: session } = useSession();
    let profileLink = '/Student/profile'; 
  
    if (session.data?.userType === 'LECTURER') {
      profileLink = '/Lecturer/profile';
    } else if (session?.data?.userType === 'COD' ){
      profileLink = '/cod/profile';
    } else if (session?.data?.userType === 'ADMIN' || session?.data?.userType === 'DEAN'){
      profileLink = '/Admin/profile';
    }
  
    const handleLogout = () => {
      if(session?.data?.userType === 'STUDENT'){
      signOut({callbackUrl: '/'})
      } else {
        signOut({callbackUrl: '/login'})
      }
    };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="User avatar" />
            <AvatarFallback>{avatar}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link className="flex" href={profileLink}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLogout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}