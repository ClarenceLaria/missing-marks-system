import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma:PrismaClient | undefined
}
const client =globalForPrisma.prisma??new PrismaClient()

if(process.env.NODE_ENV === 'production') globalForPrisma.prisma=client

export default client