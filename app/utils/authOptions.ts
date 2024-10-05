// Define UserType if it doesn't exist in @prisma/client
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/app/lib/prismadb';
import bcrypt from 'bcrypt';
import { AuthOptions } from 'next-auth';
import {PrismaAdapter} from '@next-auth/prisma-adapter';

enum UserType {
    STUDENT = 'STUDENT',
    LECTURER = 'LECTURER',
    ADMIN = 'ADMIN',
    SUPERADMIN = 'SUPERADMIN',
    COD = 'COD',
  }
type Student = {
    id: string,
    firstName: string,
    secondName: string,
    registrationNumber: string,
    hashedPassword: string,
    email: string,
    userType: UserType,
    createdAt: Date,
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
      async authorize(credentials): Promise<Student | null>  {
        const user = await prisma.Student.findUnique({
          where: { email: credentials?.email },
          select:{
            id: true,
            firstName: true,
            secondName: true,
            registrationNumber: true,
            email: true,
            userType: true,
            hashedPassword: true,
            createdAt: true,
          },
        });

        if (user) {
          user.id = user.id.toString(); // Convert id to string
        }

        if (!user) {
          throw new Error('User not found');
        }

        if (!credentials?.password) {
          throw new Error('Password is required');
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!credentials.email && !isValid) {
          throw new Error('Incorrect email or password');
        }

        return {
          id: user.id,
          firstName: user.firstName,
          secondName: user.secondName,
          hashedPassword: user.hashedPassword,
          registrationNumber: user.registrationNumber,
          email: user.email,
          userType: user.userType,
          createdAt: user.createdAt,
        };
      },
    }),
  ],
//   pages: {
//     signIn: '/auth/signin', 
//     error: '/auth/error',   
//   },
  callbacks: {
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        return{
            ...token,
            id: user.id,
            firstName: user.firstName,
            secondName: user.secondName,
            hashedPassword: user.hashedPassword,
            registrationNumber: user.registrationNumber,
            email: user.email,
            userType: user.userType,
            createdAt: user.createdAt,
        }
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      return{
        ...session,
        user: token,
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

export default NextAuth(authOptions);
