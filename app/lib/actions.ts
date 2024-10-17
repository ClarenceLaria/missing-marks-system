'use server'
import { PrismaClient, Semester } from "@prisma/client"

const prisma = new PrismaClient();

export async function fetchUnits(academicYear: string, yearOfStudy: number, semester: string) {
    console.log(academicYear, yearOfStudy, semester)
    const isValidSemester = Object.values(Semester).includes(semester as Semester);

    if (!isValidSemester) {
        throw new Error('Invalid semester value');
    }
    try {
        const units = await prisma.unit.findMany({
            where:{
                academicYear: academicYear,
                yearOfStudy: yearOfStudy,
                semester: semester as Semester,
            }
        });
        return units;
    } catch (error) {
        console.error('Error fetching units:', error)
        throw new Error('Could not fetch units')
    }
};