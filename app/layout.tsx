import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthContext from './context/AuthContext'
import ToasterContext from './context/ToasterContext'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import NavBar from './Components/NavBar'
import { ThemeProvider } from '@/app/Components/ThemeProvider';
import { Toaster } from '@/app/Components/ui/toaster';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MMTS MMUST',
  description: 'Missing Marks Tracking System',
  icons: {
    icon: [
      {
        url: '/images/icon.png',
        href: '/images/icon.png',
      }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    // <html lang="en">
    //   <body className={inter.className}>
    //     <AuthContext>
    //       <ToasterContext/>
    //       {/* <div className='w-screen h-screen flex flex-col overflow-hidden gap-1'> */}
    //         {/* <div className={clsx(`w-full bg-gray-200 shadow-md h-[10vh]`,  pathname === '/login' && 'hidden' || pathname === '/' && 'hidden')}>
    //           <NavBar></NavBar>
    //         </div> */}
    //         {/* <div className='w-full  max-h-full h-full flex flex-row'> */}
    //           <div className='h-full overflow-y-scroll w-full  overflow-x-clip'>{children}</div>
    //         {/* </div> */}
    //       {/* </div> */}
    //     </AuthContext>
    //   </body>
    // </html>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthContext>
          <ToasterContext />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthContext>
      </body>
    </html>
  )
}