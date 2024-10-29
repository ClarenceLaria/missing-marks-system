import { UserType } from '@prisma/client';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/app/lib/prismadb';
import bcrypt from 'bcrypt';
import { AuthOptions } from 'next-auth';
import {PrismaAdapter} from '@next-auth/prisma-adapter';

type Student = {
    id: string;
    firstName: string;
    secondName: string;
    regNo: string;
    password: string;
    email: string;
    userType: UserType;
    createdAt: Date;
}

type Staff = {
    id: string;
    firstName: string;
    secondName: string;
    email: string;
    phoneNumber: string;
    password: string;
    userType: UserType;
    createdAt: Date;
}
export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt', 
  },
  adapter: PrismaAdapter(prisma), 
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email'},
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<'email' | 'password', string> | undefined): Promise<Student | Staff | null>  {
        if (!credentials) {
          return null;
        } 

        const student = await prisma.student.findUnique ({
          where: { 
            email: credentials?.email, 
        },
          select:{
            id: true,
            firstName: true,
            secondName: true,
            regNo: true,
            email: true,
            userType: true,
            password: true,
            createdAt: true,
          },
        });

        if(student){
        const isStudentPassworValid = await bcrypt.compare(credentials.password, student.password);

        if(!isStudentPassworValid){
          throw new Error('Incorrect email or password');
        }

        return {
          id: `${student.id}`,
          firstName: student.firstName,
          secondName: student.secondName,
          password: student.password,
          regNo: student.regNo,
          email: student.email,
          userType: student.userType,
          createdAt: student.createdAt,
        };
        }

        const staff = await prisma.staff.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            firstName: true,
            secondName: true,
            email: true,
            phoneNumber: true,
            userType: true,
            password: true,
            createdAt: true,
          },
        });

        if (staff && staff.userType !== 'STUDENT') {
          const isStaffPasswordValid = await bcrypt.compare(credentials.password, staff.password);
          if (!isStaffPasswordValid) {
            throw new Error('Incorrect email or password');
          }

          return {
            id: `${staff.id}`,
            firstName: staff.firstName,
            secondName: staff.secondName,
            email: staff.email,
            phoneNumber: staff.phoneNumber,
            userType: staff.userType,
            password: staff.password,
            createdAt: staff.createdAt,
          };
        }
        throw new Error ('User not found or Unauthorized')
      },
    }),
  ],
//   pages: {
//     signIn: '/auth/signin', 
//     error: '/auth/error',   
//   },
  callbacks: {
    async jwt({ token, user }: { token: any, user?: any }) {
      if(user){
        return{
            ...token,
            id: user.id,
            firstName: user.firstName,
            secondName: user.secondName,
            password: user.password,
            email: user.email,
            userType: user.userType,
            createdAt: user.createdAt,
            ...(user.userType === 'STUDENT' ? {regNo: user.regNo} : {phoneNumber: user.phoneNumber}),
        };
      } 
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      return{
        ...session,
        id: token.id,
        firstName: token.firstName,
        secondName: token.secondName,
        email: token.email,
        userType: token.userType,
        createdAt: token.createdAt,
        ...(token.userType === 'STUDENT' ? { regNo: token.regNo } : { phoneNumber: token.phoneNumber}),
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

export default NextAuth(authOptions);
