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
      async authorize(credentials: Record<'email' | 'password', string> | undefined): Promise<Student | null>  {
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

        if (!student) {
          throw new Error('User not found');
        }

        if (!credentials?.password) {
          throw new Error('Password is required');
        }
        const isValid = await bcrypt.compare(credentials.password, student.password);

        if (!credentials.email && !isValid) {
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
      },
    }),
  ],
//   pages: {
//     signIn: '/auth/signin', 
//     error: '/auth/error',   
//   },
  callbacks: {
    async jwt({ token, student }: { token: any, student?: any }) {
      if (student) {
        return{
            ...token,
            id: student.id,
            firstName: student.firstName,
            secondName: student.secondName,
            password: student.password,
            regNo: student.regNo,
            email: student.email,
            userType: student.userType,
            createdAt: student.createdAt,
        }
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      return{
        ...session,
        student: token,
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

export default NextAuth(authOptions);
