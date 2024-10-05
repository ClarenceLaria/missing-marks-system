import NextAuth  from 'next-auth';


import { authOptions } from '@/app/utils/authOptions';

const secret = authOptions.secret || 'default-secret';


const options = typeof secret === 'string' ? { ...authOptions, secret } : authOptions;


const handler = NextAuth(options);

export { handler as GET, handler as POST };