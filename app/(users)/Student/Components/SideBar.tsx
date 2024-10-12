'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, FolderIcon,  ArrowRightEndOnRectangleIcon, QuestionMarkCircleIcon , ClipboardDocumentListIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';

export default function SideNav() {
  const pathName = usePathname();

  const links = [
    
    { name: 'Home', href: '/Student/home', icon: HomeIcon },
    { name: 'Reported Missing Marks', href: '/Student/reported', icon: FolderIcon },
    { name: 'Create a Report', href: '/Student/create', icon: PlusCircleIcon },
    { name: 'Help', href: '/Student/help', icon: QuestionMarkCircleIcon },
    { name: 'Logout', href: '/', icon: ArrowRightEndOnRectangleIcon },
];

  const handleLogout = () => {
    signOut({callbackUrl: '/'})
  };

  return (
    <div className='flex flex-col py-4 gap-3'>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <div key={link.name}>
            {link.name === 'Logout' ? (
              <button className={clsx(`w-full px-2 py-1 rounded-md flex h-12 items-center justify-center text-sm hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 gap-2 `, {
                'bg-sky-100 text-blue-600': pathName === link.href,
              })}
              onClick={handleLogout}
              >
                <LinkIcon className='w-6 max-[425px]:w-4'></LinkIcon>
                <p className='hidden lg:block text-xs'>{link.name} </p>
              </button>
            ): (
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
            )}
          </div>
        );
      })}
    </div>
  );
}