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

export async function fetchStudentProfile(email: string){
    try{
        const user = await prisma.student.findUnique({
            where: {
                email: email,
            }
        })
        return user;
    } catch (error){
        console.error('Error fetching user profile:', error)
        throw new Error('Could not fetch user profile')
    }
}


export async function fetchMissingReports(email: string){
    const student = await prisma.student.findUnique({
        where:{
            email: email,
        } 
    })
    if (!student) {
        throw new Error(`No student found with email: ${email}`);
      }
    const id = student?.id;
    try{
        const reports = await prisma.missingMarksReport.findMany({
            where: {
                studentId: id,
            }
        })
        return reports;
    }catch(error){
        console.error('Error fetching user missing mark reports:', error)
        throw new Error ("Failed to fetch missing mark reports")
    }
}

export async function fetchReportNumbers(email: string){
    const student = await prisma.student.findUnique({
        where:{
            email: email
        }
    })
    const id = student?.id;
    
    try{
        const TotalReports = await prisma.missingMarksReport.count({
            where:{
                studentId: id,
            }
        })
        const pendingTotals = await prisma.missingMarksReport.count({
            where:{
                studentId: id,
                reportStatus: "PENDING"
            }
        })
        const markFoundTotals = await prisma.missingMarksReport.count({
            where:{
                studentId: id,
                reportStatus: "MARK_FOUND"
            }
        })
        const markNotFoundTotals = await prisma.missingMarksReport.count({
            where:{
                studentId: id,
                reportStatus: "MARK_NOT_FOUND"
            }
        })
        const forInvestigationTotals = await prisma.missingMarksReport.count({
            where:{
                studentId: id,
                reportStatus: "FOR_FURTHER_INVESTIGATION"
            }
        })
        return {TotalReports, pendingTotals, markFoundTotals, markNotFoundTotals, forInvestigationTotals} 
    }catch(error){
        console.error("Error counting totals:", error)
        throw new Error("Could not count Reports")
    }
}