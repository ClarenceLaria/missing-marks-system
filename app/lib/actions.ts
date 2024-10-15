'use server'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function fetchUnits(req:Request, res:Response) {
    const { year, semester } = await req.json();
    const request = await prisma.unit.findMany({
        where:{
            AND: {
                yearOfStudy: parseInt(year),
                semester: semester,
            }
        }
    });
}