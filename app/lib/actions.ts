'use server'
import { PrismaClient, Semester } from "@prisma/client"

const prisma = new PrismaClient();

export async function fetchUnits(email: string, academicYear: string, yearOfStudy: number, semester: string) {
    console.log(academicYear, yearOfStudy, semester, email)
    const isValidSemester = Object.values(Semester).includes(semester as Semester);

    if (!isValidSemester) {
        throw new Error('Invalid semester value');
    }
    const user = await prisma.student.findUnique({
        where: {
            email: email, 
        },
        select: {
            courseId: true,
        },
    });
    if (!user || !user.courseId) {
        throw new Error('User does not have an associated course');
    }
    const courseId = user.courseId;
    try {
        const units = await prisma.unit.findMany({
            where:{
                academicYear: academicYear,
                yearOfStudy: yearOfStudy,
                semester: semester as Semester,
                courses: {
                    some: {
                        courseId: courseId,
                    },
                }
            },
            include: {
                courses:{
                    select: {
                        courseId: true,
                    },
                },
            },
        });
        return units;
    } catch (error) {
        console.error('Error fetching units:', error)
        throw new Error('Could not fetch units')
    }
};