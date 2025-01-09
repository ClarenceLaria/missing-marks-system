'use server'
import dotenv from 'dotenv'
import { PrismaClient, Semester } from "@prisma/client"
import http from 'http'
import { getServerSession } from 'next-auth';
import {authOptions} from '../utils/authOptions';
import { UserType } from "@prisma/client";

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

export async function fetchStaffProfile(){
    try{
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            throw new Error('User is not authenticated');
        }
        const email = session.user.email!;
        const user = await prisma.staff.findUnique({
            where: {
                email: email,
            },
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

export async function fetchLecturerMissingMarksTotals(){
    try{
        const session = await getServerSession(authOptions);
        const email = session?.user?.email!;

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

export async function fetchLecturerMissingMarks(){
    try{
        const session = await getServerSession(authOptions);
        const email = session?.user?.email!;

        const lecturer = await prisma.staff.findUnique({
            where:{
                email: email,
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
                // reportStatus: { in: ["FOR_FURTHER_INVESTIGATION", "PENDING"] }
            },
            include:{
                student: {
                    select:{
                        regNo: true,
                        firstName: true,
                        secondName: true,
                    }
                },
            },
        })
        return reports;
    }catch(error){
        console.error("Error fetching missing marks:", error)
        throw new Error("Could not fetch missing marks")
    }
}

export async function fetchLecturerUnits(){
    try{
        const session = await getServerSession(authOptions);
        const email = session?.user?.email!;
        
        const lec = await prisma.staff.findUnique({
            where:{
                email: email,
            },
        });
        const lecId = lec?.id;

        const units = await prisma.unit.findMany({
            where:{
                lecturerId: lecId,
            },
            include: {
                courses:{
                    select:{
                        course:{
                            include:{
                                students: {
                                    select:{
                                        id: true,
                                    }
                                },
                            }
                        }
                    }
                }
            }
        });

        const unitDetails = units.map((unit) => {
            // const totalDepartments = school.departments.length;
            const totalStudents = unit.courses.reduce(
              (acc, course) => acc + course.course.students.length,
              0
            );
            
            return {
              id: unit.id,
              name: unit.name,
              code: unit.code,
              year: unit.academicYear,
              totalStudents,
            };
          });
        

        return unitDetails;
    }catch(error){
        console.error("Error fetching Units: ", error);
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
        // throw new Error("Could not fetch User Totals")
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

export async function fetchDepartmentReports(){
    try{
        const session = await getServerSession(authOptions);
        const email = session?.user?.email!;

        const cod = await prisma.staff.findUnique({
            where:{
                email: email,
            }
        })
        const codDeptId = cod?.departmentId;

        const allReports = await prisma.missingMarksReport.findMany({
            where:{
                student:{
                    departmentId: codDeptId,
                }
            },
            include:{
                student: {
                    select:{
                        regNo: true,
                        firstName: true,
                        secondName: true,
                    }
                }
            }
        });

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
        return {pendingReports, forwardedReports, clearedReports, allReports};
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
        const schoolId = dean?.schoolId;

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

        const totalDepartments = await prisma.department.count({
            where:{
                schoolId: schoolId,
            },
        });

        const totalCleared = markFoundTotals + markNotFoundTotals;

        return {pendingTotals, markFoundTotals, markNotFoundTotals, forInvestigationTotals, totalCleared, totalReports, totalDepartments};
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
        const schoolId = dean?.schoolId;

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

        const schoolId = dean?.schoolId;

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

        const schoolId = dean?.departmentId;

        const reports = await prisma.missingMarksReport.findMany({
            where:{
                student:{
                    department:{
                        schoolId: schoolId,
                    },
                },
            },
            include: {
                student: {
                    select:{
                        regNo:true,
                        firstName: true,
                        secondName: true,
                    },
                },
            },
        });

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
        
        const reportWithStudents = reports.map((report) => ({
            ...report,
            student: {
                regNo: report.student.regNo,
                name: `${report.student.firstName + " " + report.student.secondName}`,
            }
        }))
        return {pendingReports, clearedReports, forwardedReports, reports: reportWithStudents};
    }catch(error){
        console.error("Error fetching missing marks: ", error)
    }
}

export async function fetchAdminTotals(){
    try{
        const totalStudents = await prisma.student.count();
        const totalLecturers = await prisma.staff.count();
        const totalSchools = await prisma.school.count();
        const totalCourses = await prisma.course.count();
        return {totalLecturers, totalStudents, totalSchools, totalCourses};
    }catch(error){
        console.error('Error fetching totals for admin:', error)
    }
}

export async function fetchMissingReportsStats () {
    try{
        const reportStats = await prisma.missingMarksReport.groupBy({
            by: ['createdAt'],
            _count: {_all: true},
            orderBy: {createdAt: 'asc'},
        })
         // Transform the results to group data by month
        const monthlyData = reportStats.reduce((acc, record) => {
        const month = new Date(record.createdAt).toLocaleString('default', { month: 'short' });
        const year = new Date(record.createdAt).getFullYear();
        const monthKey = `${month} ${year}`; // Example: "Jan 2024"
  
        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: monthKey,
            missingMarks: 0,
          };
        }
  
        acc[monthKey].missingMarks += record._count._all;
  
        return acc;
      }, {} as Record<string, { month: string; missingMarks: number }>);
  
      // Convert the grouped data to an array
      return Object.values(monthlyData);
        // return reportStats;
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
export async function fetchSchools () {
    try{
        const schools = await prisma.school.findMany();
        
        return schools;
    }catch(error){
        console.error("Error Fetching School Info", error)
    }
}

export async function fetchSchoolDetails() {
    try {
      const schools = await prisma.school.findMany({
        select: {
          id: true, // School ID
          name: true, // School name
          departments: {
            select: {
              id: true, // For counting the number of departments
              students: {
                select: {
                  id: true, // For counting the number of students
                },
              },
              staffS: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      
      const deptToSchoolMap: { [key: number]: number } = {};
      schools.forEach((school) => {
        school.departments.forEach((department) => {
          deptToSchoolMap[department.id] = school.id; // Map department ID to school ID
        });
      });
  
      const departmentIds = Object.keys(deptToSchoolMap).map(Number);
      const deans = await prisma.staff.findMany({
        where: {
            userType: "DEAN",
            departmentId: {
                in: departmentIds,
            }
        },
        select: {
            id: true,
            firstName: true,
            secondName: true,
            departmentId: true, // To map back to schools
          },
      });

      const schoolDeanMap: { [key: number]: any[] } = {};
        deans.forEach((dean) => {
        const schoolId = deptToSchoolMap[dean.departmentId];
        if (!schoolDeanMap[schoolId]) {
            schoolDeanMap[schoolId] = [];
        }
        schoolDeanMap[schoolId].push(dean); // Group deans by school
        });

      // Process data to include counts
      const schoolDetails = schools.map((school) => {
        const totalDepartments = school.departments.length;
        const totalStudents = school.departments.reduce(
          (acc, department) => acc + department.students.length,
          0
        );
        const totalLecturers = school.departments.reduce(
          (acc, department) => acc + department.staffS.length,
          0
        );  
        const deans = schoolDeanMap[school.id] || [];
        return {
          id: school.id,
          name: school.name,
          totalDepartments,
          totalStudents,
          totalLecturers,
          deans,
        };
      });
      return schoolDetails;
    } catch (error) {
      console.error("Error fetching school details:", error);
      throw error;
    }
  }
  

  export async function fetchSchoolReportStatistics() {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.email) {
        throw new Error('User is not authenticated');
      }
  
      const email = session.user.email;
  
      const dean = await prisma.staff.findUnique({
        where: { email },
        select: { schoolId: true }, 
      });
  
      if (!dean || !dean.schoolId) {
        throw new Error('Dean not found or schoolId is missing');
      }
  
      const statistics = await prisma.missingMarksReport.groupBy({
        by: ['reportStatus'],
        _count: { id: true },
        where: {
          student: {
            department: {
              schoolId: dean.schoolId,
            },
          },
        },
      });
  
      return statistics.map((stat) => ({
        reportStatus: stat.reportStatus,
        count: stat._count.id,
      }));
    } catch (error) {
      console.error('Error Fetching School Stats:', error);
    //   return { error: error.message || 'An unexpected error occurred' };
    }
  }

  export async function fetchSchoolDepartmentsOverview() {
    try {
      const session = await getServerSession(authOptions);
  
      const email = session?.user?.email!;
      if (!email) {
        throw new Error("User is not authenticated");
      }
  
      // Get the dean's school ID
      const dean = await prisma.staff.findUnique({
        where: { email },
        select: { schoolId: true },
      });
  
      const schoolId = dean?.schoolId;
      if (!schoolId) {
        throw new Error("Dean's school ID not found");
      }
  
      // Fetch departments, including students count, lecturers count, and CODs
      const departments = await prisma.department.findMany({
        where: {
          schoolId: schoolId,
        },
        select: {
          id: true,
          name: true,
          students: {
            select: {
              id: true,
            },
          },
          staffS: {
            select: {
              id: true,
              firstName: true,
              secondName: true,
              email: true,
              userType: true,
            },
            where: {
              userType: "COD", // Filter CODs for each department
            },
          },
        },
      });
  
      // Format the data to map CODs back to their respective departments
      const formattedDepartments = departments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        totalStudents: dept.students.length, // Count of students
        totalLecturers: dept.staffS.filter((staff) => staff.userType !== "COD").length, // Count of lecturers excluding CODs
        cod: dept.staffS[0] // Assuming there is only one COD per department
          ? {
              id: dept.staffS[0].id,
              firstName: dept.staffS[0].firstName,
              secondName: dept.staffS[0].secondName,
              email: dept.staffS[0].email,
            }
          : null,
      }));
  
      return formattedDepartments;
    } catch (error) {
      console.error("Error fetching departments overview: ", error);
      throw new Error("Could not fetch departments overview");
    }
  }
  
  

export async function fetchUniversityUsersArray (){
    try{
        const lecturers = await prisma.staff.findMany({
            select:{
                id: true,
                firstName: true,
                secondName: true,
                email: true,
                userType: true,
                userStatus: true,
                department: {
                    select: {
                        school: {
                            select: {
                                name: true,
                            }
                        }
                    },
                },
            },
        });
        const students = await prisma.student.findMany({
            select: {
                id: true,
                firstName: true,
                secondName: true,
                email: true,
                userType: true,
                userStatus: true,
                department: {
                    select: {
                        school: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        });
        const normalizedLecturers = lecturers.map((lecturer) => ({
            id: lecturer.id,
            name: `${lecturer.firstName} ${lecturer.secondName}`,
            email: lecturer.email,
            userType: lecturer.userType,
            userStatus: lecturer.userStatus,
            school: lecturer.department?.school?.name || "Unknown",
          }));
          const normalizedStudents = students.map((student) => ({
            id: student.id,
            name: `${student.firstName} ${student.secondName}`,
            email: student.email,
            userType: student.userType,
            userStatus: student.userStatus,
            school: student.department?.school?.name || "Unknown",
          }));
        return [...normalizedLecturers, ...normalizedStudents];
    }catch(error){
        console.error("Error Fetching University Users", error)
    }
}

export async function fetchUniversityUsers(){
    try{
        const lecturers = await prisma.staff.findMany();
        const students = await prisma.student.findMany();

        return {lecturers, students}
    }catch(error){
        console.error("Error fetching users:", error)
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
            return { messageInfo, status };
        } else {
            const errorText = await response.text();
            console.error(`Failed to send message. Status code: ${response.status}, Error: ${errorText}`);
        }
    }catch(error: any){
        console.error("Error sending SMS: ", error.message || error);
    }
}

export async function fetchDepartments (schoolId: number) {
    try{
        const departments = await prisma.department.findMany({
            select: {
                name: true,
                id: true,
            },
            where: {
                schoolId: schoolId,
            }
        });
        return departments;
    }catch(error){
        console.error("Error fetching departments:", error);
    }
}

export async function deleteSchool() {
    try {
      const school = await prisma.school.delete({
        where: {
          id: 1,
        },
      });
      
      return school;
    } catch (error) {
      console.error("Error deleting school:", error);
    }
}

export async function fetchDepartmentsBySchoolId(schoolId: number) {
    try {
      const departments = await prisma.department.findMany({
        where: {
          schoolId: schoolId,
        },
      });
      return departments;
    } catch (error) {
      console.error("Error fetching departments by school ID:", error);
    }
  }

  export async function fetchPrograms(){
    try{
        const courses = await prisma.course.findMany({
            select:{
                id: true,
                name: true,
                department: {
                    select: {
                        name: true,
                        school: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
            }
        });

        return courses;
    }catch(error){
        console.error("Error fetching courses: ", error)
    }
  }

  export async function fetchProgramsBySchoolId(schoolId: number){
    try{
        const courses = await prisma.course.findMany({
            where:{
                department:{
                    schoolId: schoolId,
                }
            },
            select:{
                id: true,
                name: true,
            },
        });

        return courses;
    }catch(error){
        console.error("Error fetching courses: ", error)
    }
  }

  export async function fetchUnitsForAdmin(){
    try{
        const units = await prisma.unit.findMany({
            include: {
                courses: {
                  include: {
                    course: {
                      include: {
                        department: {
                          include: {
                            school: true, // Fetch the school name
                          },
                        },
                        students: true, // Fetch students to count them
                      },
                    },
                  },
                },
                lecturer: true, // Fetch lecturer information
              },
        });

        const formattedUnits = units.map((unit) => {
            const allCourses = unit.courses.map((unitCourse) => unitCourse.course);
            const schoolName = allCourses.length > 0 ? allCourses[0].department.school.name : null;
      
            return {
              unitId: unit.id,
              unitName: unit.name,
              unitCode: unit.code,
              academicYear: unit.academicYear,
              schoolName: schoolName,
              courses: allCourses.map((course) => course.name), // Course names
              lecturer: `${unit.lecturer.firstName} ${unit.lecturer.secondName}`, // Lecturer name
              totalStudents: allCourses.reduce(
                (sum, course) => sum + course.students.length,
                0
              ), // Total students
            };
          });
        return formattedUnits;
    }catch(error){
        console.error("Error fetching units: ", error)
    }
  }

  export async function fetchUnitsForDean(){
    try{
        const session = await getServerSession(authOptions);
        const email = session?.user?.email!;

        const dean = await prisma.staff.findUnique({
            where:{
                email: email,
            },
            select:{
                schoolId: true,
            }
        });
        const schoolId = dean?.schoolId;
        const units = await prisma.unit.findMany({
            where:{
                courses:{
                    some:{
                        course:{
                            department:{
                                schoolId: schoolId,
                            },
                        },
                    },
                }
            },
            include: {
                courses: {
                  include: {
                    course: {
                      include: {
                        department: true,
                        students: true, // Fetch students to count them
                      },
                    },
                  },
                },
                lecturer: true, // Fetch lecturer information
              },
        });

        const formattedUnits = units.map((unit) => {
            const allCourses = unit.courses.map((unitCourse) => unitCourse.course);
      
            return {
              unitId: unit.id,
              unitName: unit.name,
              unitCode: unit.code,
              academicYear: unit.academicYear,
              courses: allCourses.map((course) => course.name), // Course names
              lecturer: `${unit.lecturer.firstName} ${unit.lecturer.secondName}`, // Lecturer name
              totalStudents: allCourses.reduce(
                (sum, course) => sum + course.students.length,
                0
              ), // Total students
            };
          });
        return formattedUnits;
    }catch(error){
        console.error("Error fetching units: ", error)
    }
  }