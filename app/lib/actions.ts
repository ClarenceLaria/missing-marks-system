'use server'
import dotenv from 'dotenv'
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

export async function fetchDepartmentUsers(email:string){
    try{
        const cod = await prisma.staff.findUnique({
            where:{
                email: email,
            }
        })
        const codDeptId = cod?.departmentId;
        const lecturers = await prisma.staff.findMany({
            where:{
                departmentId: codDeptId,
            }
        })
        const students = await prisma.student.findMany({
            where:{
                departmentId: codDeptId,
            }
        })
        return {students, lecturers};
    }catch(error){
        console.error("Error fetching Department Users", error);
        throw new Error("Could not fetch Department Users")
    }
}

export async function fetchDepartmentReports(email: string){
    try{
        const cod = await prisma.staff.findUnique({
            where:{
                email: email,
            }
        })
        const codDeptId = cod?.departmentId;

        const clearedReports = await prisma.missingMarksReport.findMany({
            where:{
                student: {
                    departmentId: codDeptId,
                },
                reportStatus: { in: ["MARK_FOUND", "MARK_NOT_FOUND"]},
            }
        })
        const pendingReports = await prisma.missingMarksReport.findMany({
            where:{
                student: {
                    departmentId: codDeptId,
                },
                reportStatus: "PENDING",
            }
        })
        const forwardedReports = await prisma.missingMarksReport.findMany({
            where:{
                student: {
                    departmentId: codDeptId,
                },
                reportStatus: "FOR_FURTHER_INVESTIGATION",
            }
        })
        return {pendingReports, forwardedReports, clearedReports};
    }catch(error){
        console.error("Error fetching Department Missing Marks:", error);
    }
}

export async function fetchDepartmentSingleReport(reportId: number){
    try{
        const report = await prisma.missingMarksReport.findFirst({
            where:{
                id: reportId,
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
        console.error("Error fetching Report: ", error);
    }
}

export async function fetchSchoolTotals(email: string){
    try{
        const dean = await prisma.staff.findUnique({
            where:{
                email: email,
            },
            include:{

            }
        });
        const deptId = dean?.departmentId;

        const dept = await prisma.department.findUnique({
            where:{
                id: deptId,
            },
            include:{
                school: true,
            }
        })
        const schoolId = dept?.schoolId;

        const pendingTotals = await prisma.missingMarksReport.count({
            where:{
                reportStatus: "PENDING",
                student:{
                    department:{
                        schoolId: schoolId,
                    }
                }
            }
        })

        const markFoundTotals = await prisma.missingMarksReport.count({
            where:{
                reportStatus: "MARK_FOUND",
                student:{
                    department:{
                        schoolId: schoolId,
                    }
                }
            }
        });

        const markNotFoundTotals = await prisma.missingMarksReport.count({
            where:{
                reportStatus: "MARK_NOT_FOUND",
                student:{
                    department:{
                        schoolId: schoolId,
                    }
                }
            }
        });

        const forInvestigationTotals = await prisma.missingMarksReport.count({
            where:{
                reportStatus: "FOR_FURTHER_INVESTIGATION",
                student:{
                    department:{
                        schoolId: schoolId,
                    }
                }
            }
        });

        const totalReports = await prisma.missingMarksReport.count({
            where:{
                student:{
                    department:{
                        schoolId: schoolId,
                    }
                }
            }
        });

        const totalCleared = markFoundTotals + markNotFoundTotals;

        return {pendingTotals, markFoundTotals, markNotFoundTotals, forInvestigationTotals, totalCleared, totalReports};
    }catch(error){
        console.error("Error Fetching School Totals: ", error);
    }
}

export async function fetchSchoolUsersTotals(email: string){
    try{
        const dean = await prisma.staff.findUnique({
            where:{
                email: email,
            },
            include:{

            }
        });
        const deptId = dean?.departmentId;

        const dept = await prisma.department.findUnique({
            where:{
                id: deptId,
            },
            include:{
                school: true,
            }
        })
        const schoolId = dept?.schoolId;

        const lecturers = await prisma.staff.count({
            where:{
                department:{
                    schoolId: schoolId,
                }
            }
        })

        const students = await prisma.student.count({
            where:{
                department:{
                    schoolId: schoolId,
                }
            }
        })

        const totalUsers = lecturers + students;
        return {lecturers, students, totalUsers};
    }catch(error){
        console.error("Error Fetching School Users Totals: ", error);
    }
}

export async function fetchSchoolUsers(email: string){
    try{
        const dean = await prisma.staff.findUnique({
            where:{
                email: email,
            },
            include:{

            }
        });
        const deptId = dean?.departmentId;

        const dept = await prisma.department.findUnique({
            where:{
                id: deptId,
            },
            include:{
                school: true,
            }
        })
        const schoolId = dept?.schoolId;

        const lecturers = await prisma.staff.findMany({
            where:{
                department:{
                    schoolId: schoolId,
                }
            }
        })

        const students = await prisma.student.findMany({
            where:{
                department:{
                    schoolId: schoolId,
                }
            }
        })

        return {lecturers, students};
    }catch(error){
        console.error("Error Fetching School Users: ", error);
    }
}

export async function fetchSchoolReports(email: string){
    try{
        const dean = await prisma.staff.findUnique({
            where:{
                email: email,
            },
        });

        const deptId = dean?.departmentId;
        const dept = await prisma.department.findUnique({
            where:{
                id: deptId,
            }
        });
        const schoolId = dept?.schoolId;
        const pendingReports = await prisma.missingMarksReport.findMany({
            where:{
                reportStatus: "PENDING",
                student:{
                    department:{
                        schoolId: schoolId,
                    }
                }
            }
        });

        const clearedReports = await prisma.missingMarksReport.findMany({
            where:{
                reportStatus: {in: ["MARK_FOUND", "MARK_NOT_FOUND"]},
                student:{
                    department:{
                        schoolId: schoolId,
                    }
                }
            }
        });

        const forwardedReports = await prisma.missingMarksReport.findMany({
            where:{
                reportStatus: "FOR_FURTHER_INVESTIGATION",
                student:{
                    department:{
                        schoolId: schoolId,
                    }
                }
            }
        });

        return {pendingReports, clearedReports, forwardedReports};
    }catch(error){
        console.error("Error fetching missing marks: ", error)
    }
}

export async function fetchAdminTotals(){
    try{
        const pendingTotals = await prisma.missingMarksReport.count({
            where:{
                reportStatus: "PENDING",
            }
        });
        const markFoundTotals = await prisma.missingMarksReport.count({
            where:{
                reportStatus: "MARK_FOUND",
            }
        })
        const notFoundTotals = await prisma.missingMarksReport.count({
            where:{
                reportStatus: "MARK_NOT_FOUND",
            }
        });
        const forwardedTotals = await prisma.missingMarksReport.count({
            where:{
                reportStatus: "FOR_FURTHER_INVESTIGATION",
            }
        });
        const totalStudents = await prisma.student.count();
        const totalLecturers = await prisma.staff.count();
        const totalUsers = totalStudents + totalLecturers;
        return {pendingTotals, markFoundTotals, notFoundTotals, forwardedTotals, totalUsers, totalLecturers, totalStudents};
    }catch(error){
        console.error('Error fetching totals for admin:', error)
    }
}

export async function fetchMissingReportsStats () {
    try{
        const reportStats = await prisma.missingMarksReport.groupBy({
            by: ['reportStatus', 'createdAt'],
            _count: {_all: true},
            orderBy: {createdAt: 'asc'},
        })
        return reportStats;
    }catch(error){
        console.error('Error Fetching Stats', error);
    }
}

export async function fetchMissingReportsStatsByUnit () {
    try{
        const reportStats = await prisma.missingMarksReport.groupBy({
            by: ['reportStatus', 'unitId'],
            _count: {_all: true},
        })
        return reportStats;
    }catch(error){
        console.error('Error Fetching Stats', error);
    }
}
export async function fetchSchoolAbbreviations () {
    try{
        const schools = await prisma.school.findMany({
            select: {
                abbreviation: true,
            }
        })
        return schools;
    }catch(error){
        console.error("Error Fetching School Info", error)
    }
}

export async function fetchSchoolReportStatistics (abbreviation: string) {
    try{
        const school = await prisma.school.findUnique({
            where:{
                abbreviation: abbreviation,
            }
        });
        const schoolId = school?.id;
        const reportStats = await prisma.missingMarksReport.groupBy({
            by: ['reportStatus', 'createdAt'],
            _count: {_all: true},
            where:{
                student:{
                    department:{
                        school: {
                            abbreviation: abbreviation,
                        },
                    }
                }
            },
            orderBy: {createdAt: 'asc'},
        })
        return reportStats;
    }catch(error){
        console.error('Error Fetching School Stats', error);
    }
}

export async function fetchUniversityUsers (){
    try{
        const lecturers = await prisma.staff.findMany();
        const students = await prisma.student.findMany();
        return {lecturers, students};
    }catch(error){
        console.error("Error Fetching University Users", error)
    }
}

export async function fetchUniversityMissingReports () {
    try{
        const pending = await prisma.missingMarksReport.findMany({
            where: {
                reportStatus: "PENDING"
            }
        })

        const cleared = await prisma.missingMarksReport.findMany({
            where: {
                reportStatus: {in: ['MARK_FOUND', 'MARK_NOT_FOUND']}
            }
        })

        const forInvestigation = await prisma.missingMarksReport.findMany({
            where: {
                reportStatus: 'FOR_FURTHER_INVESTIGATION'
            }
        })
        return {pending, cleared, forInvestigation};
    }catch(error){
        console.error("Error fetching reports: ", error)
    }
}

export async function fetchLecDetails (lecId: number){
    try{
        const lecturer = await prisma.staff.findUnique({
            where: {
                id: lecId,
            },
        });
        const phoneNo = lecturer?.phoneNumber;

        return lecturer;
    }catch(error){
        console.error("Error fetching phone number: ", error)
    }
}

dotenv.config();
export default async function sendSMS(phoneNo: string, message: string){
    const username = process.env.SANDBOX_USERNAME!;
    const api_key = process.env.APIKEY!;
    const senderId = process.env.ALPHANUMERIC!;
    const url = 'https://api.sandbox.africastalking.com/version1/messaging';

    if(!username || !api_key || !senderId){
        throw new Error("Username or API Key not found")
    }
    const headers = {
        apikey: api_key as string,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      };
    
    const data = new URLSearchParams({
        username,
        to: phoneNo,
        message,
        from: senderId,
    });

    try{
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: data,
        });

        if (response.ok){
            const resData = await response.json();
            const messageInfo = resData.SMSMessageData.Message;
            const status = resData.SMSMessageData.Recipients[0]?.status;
            console.log(`Message sent: ${messageInfo}, Status: ${status}`);
        } else {
            console.error(`Failed to send message. Status code: ${response.status}`);
        }
    }catch(error: any){
        console.error("Error sending SMS: ", error.message || error);
    }
}