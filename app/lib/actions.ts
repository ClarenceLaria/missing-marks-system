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

export async function fetchStaffProfile(email: string){
    try{
        const user = await prisma.staff.findUnique({
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


export async function fetchSingleReport(email: string, reportId: number){
    try{
        const student = await prisma.student.findUnique({
            where:{
                email: email
            },
            include:{
                department: true,
            }
        })
        const dept = student?.department?.name;
        const dptid = student?.department?.id;
        const id = student?.id;

        const school = await prisma.department.findUnique({
            where:{
                id: dptid
            },
            include: {
                school: true,
            }
        })
        
        const report = await prisma.missingMarksReport.findUnique({
            where:{
                id: reportId,
                studentId: id,
            }
        })
        return {student, report, dept, school};
    }catch(error){
        console.error("Error fetching report details:", error)
        throw new Error("Could not fetch report details")
    }
}

export async function fetchLecturerMissingMarksTotals(email:string){
    try{
        const lecturer = await prisma.staff.findUnique({
            where:{
                email: email
            }
        })
        const id = lecturer?.id;
        const units = await prisma.unit.findMany({
            where:{
                lecturerId: id,
            }
        })
        const unitIds = units.map(unit => unit.id);

        const totalLecsMissingMarks = await prisma.missingMarksReport.count({
            where:{
                unitId: {
                    in: unitIds
                }
            }
        });
        const pendingTotals = await prisma.missingMarksReport.count({
            where:{
                unitId: {
                    in: unitIds
                },
                reportStatus: "PENDING"
            }
        })
        const markFoundTotals = await prisma.missingMarksReport.count({
            where:{
                unitId: {
                    in: unitIds
                },
                reportStatus: "MARK_FOUND"
            }
        })
        const markNotFoundTotals = await prisma.missingMarksReport.count({
            where:{
                unitId: {
                    in: unitIds
                },
                reportStatus: "MARK_NOT_FOUND"
            }
        })
        const totalCleared = markFoundTotals + markNotFoundTotals;
        const forInvestigationTotals = await prisma.missingMarksReport.count({
            where:{
                unitId: {
                    in: unitIds
                },
                reportStatus: "FOR_FURTHER_INVESTIGATION"
            }
        })
        return {totalLecsMissingMarks, forInvestigationTotals, markFoundTotals, markNotFoundTotals, pendingTotals, totalCleared};
    }catch(error){
        console.error("Error fetching missing marks:", error)
        throw new Error("Could not fetch missing marks")
    }

}

export async function fetchLecturerMissingMarks(email: string){
    try{
        const lecturer = await prisma.staff.findUnique({
            where:{
                email: email
            }
        })
        const id = lecturer?.id;
        const units = await prisma.unit.findMany({
            where:{
                lecturerId: id,
            }
        })
        const unitIds = units.map(unit => unit.id);

        const reports = await prisma.missingMarksReport.findMany({
            where:{
                unitId: {
                    in: unitIds
                },
                reportStatus: { in: ["FOR_FURTHER_INVESTIGATION", "PENDING"] }
            }
        })
        return reports;
    }catch(error){
        console.error("Error fetching missing marks:", error)
        throw new Error("Could not fetch missing marks")
    }
}

export async function fetchSingleUnclearedReport(email: string, reportId:number){
    try{
        const lecturer = await prisma.staff.findUnique({
            where:{
                email: email,
            }
        })
        const lecturerId = lecturer?.id;
        const report = await prisma.missingMarksReport.findFirst({
            where:{
                id: reportId,
                unit:{
                    lecturerId: lecturerId,
                },
            },
            include:{
                student: true,
                unit:true,
            },
        });
        const student = report?.student;
        const dept = await prisma.department.findUnique({
            where:{
                id: student?.departmentId,
            },
        });
        const school = await prisma.school.findUnique({
            where:{
                id: dept?.schoolId,
            },
        });
        return {report, student, dept, school};
    }catch(error){
        console.log('Error fetching single report:', error);
        throw new Error('Could not fetch Single Report');
    }
}

export async function fetchClearedReports(email:string){
    try{
        const lecturer = await prisma.staff.findUnique({
            where:{
                email: email,
            }
        })
        const lecturerId = lecturer?.id;
        const reports = await prisma.missingMarksReport.findMany({
            where:{
                unit:{
                    lecturerId: lecturerId,
                },
                reportStatus: {in: ["MARK_FOUND", "MARK_NOT_FOUND"]},
            },
        });
        return reports;
    }catch(error){
        console.error('Error fetching cleared reports:', error)
        throw new Error('Could not fetch cleared reports')
    }
}

export async function fetchForwardedReport(email:string){
    try{
        const lecturer = await prisma.staff.findUnique({
            where: {
                email: email,
            }
        });
        const lecturerId = lecturer?.id;
        const reports = await prisma.missingMarksReport.findMany({
            where:{
                unit:{
                    lecturerId: lecturerId,
                },
                reportStatus: "FOR_FURTHER_INVESTIGATION",
            }
        });
        return reports;
    }catch(error){
        console.error('Error fetching forwarded reports:', error)
        throw new Error('Could not fetch forwarded reports')
    }
}

export async function fetchDepartmentTotals(email: string) {
    try{
        const cod = await prisma.staff.findUnique({
            where:{
                email: email,
            }
        });
        const codDeptId = cod?.departmentId
        const totalReports = await prisma.missingMarksReport.count({
            where:{
                student:{
                    departmentId: codDeptId,
                }
            }
        })
        const pendingTotals = await prisma.missingMarksReport.count({
            where:{
                student:{
                    departmentId: codDeptId,
                },
                reportStatus: "PENDING"
            }
        })
        const markFoundTotals = await prisma.missingMarksReport.count({
            where:{
                student:{
                    departmentId: codDeptId,
                },
                reportStatus: "MARK_FOUND"
            }
        })
        const notFoundTotals = await prisma.missingMarksReport.count({
            where:{
                student:{
                    departmentId: codDeptId,
                },
                reportStatus: "MARK_FOUND"
            }
        })
        const forwardedTotals = await prisma.missingMarksReport.count({
            where:{
                student:{
                    departmentId: codDeptId,
                },
                reportStatus: "FOR_FURTHER_INVESTIGATION"
            }
        })
        const clearedTotals = await prisma.missingMarksReport.count({
            where:{
                student:{
                    departmentId: codDeptId,
                },
                reportStatus: { in: ["MARK_FOUND", "MARK_NOT_FOUND"]}
            }
        })
        return {totalReports, pendingTotals, clearedTotals, markFoundTotals, notFoundTotals, forwardedTotals};
    }catch(error){
        console.error('Error fetching department totals:', error)
        throw new Error("Could not fetch missing mark Totals")
    }
}

export async function fetchDepartmentUserTotals(email: string) {
    try{
        const cod = await prisma.staff.findUnique({
            where:{
                email: email,
            }
        })
        const codDeptId = cod?.departmentId;
        const lecturers = await prisma.staff.count({
            where:{
                departmentId: codDeptId,
            }
        })
        const students = await prisma.student.count({
            where:{
                departmentId: codDeptId,
            }
        })
        const totalUsers = lecturers + students;
        return {lecturers, students, totalUsers}
    }catch(error){
        console.error("Error fetching user totals", error)
        throw new Error("Could not fetch User Totals")
    }
}