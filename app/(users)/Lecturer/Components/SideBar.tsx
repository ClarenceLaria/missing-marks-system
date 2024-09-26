'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, FolderIcon,  ArrowRightEndOnRectangleIcon, PaperAirplaneIcon , DocumentCheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function SideNav() {
  const pathName = usePathname();

  const links = [
    
    { name: 'Home', href: '/Lecturer', icon: HomeIcon },
    { name: 'Submissions', href: '/Lecturer/submissions', icon: FolderIcon },
    { name: 'Cleared Submissions', href: '/Lecturer/cleared', icon: DocumentCheckIcon },
    { name: 'Forwarded', href: '/Lecturer/forwarded', icon: PaperAirplaneIcon },
    { name: 'Logout', href: '/', icon: ArrowRightEndOnRectangleIcon },
];

  return (
    <div className='flex flex-col py-4 gap-3'>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            className={clsx(`w-full px-2 py-1 rounded-md flex h-12 items-center justify-center text-sm hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 gap-2 `, {
              'bg-sky-100 text-blue-600': pathName === link.href,
            })}
            key={link.name}
            href={link.href}
          >
            <LinkIcon className='w-6 max-[425px]:w-4'></LinkIcon>
            <p className='hidden lg:block text-xs'>{link.name} </p>
          </Link>
        );
      })}
    </div>
  );
}