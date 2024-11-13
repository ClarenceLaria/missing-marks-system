'use client'
import Input from '@/app/Components/Input'
import Loader from '@/app/Components/Loader';
import { fetchDepartmentSingleReport, fetchSingleReport, fetchSingleUnclearedReport } from '@/app/lib/actions';
import { ExamType, ReportStatus, Semester, UserType } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface missingReport {
  academicYear: string;
  yearOfStudy: number;
  semester: Semester;
  examType: ExamType;
  lecturerName: string;
  id: number;
  unitName: string;
  unitCode: string;
  reportStatus: ReportStatus;
  studentId: number;
  createdAt: Date;
}

interface department {
  id: number;
  name: string;
  schoolId: number;
};

interface Student {
    id: number;
    createdAt: Date;
    email: string;
    firstName: string;
    secondName: string;
    password: string;
    userType: UserType;
    departmentId: number;
    regNo: string;
    courseId: number;
  }

  interface School {
    id: number;
    name: string;
    abbreviation: string;
  }
export default function Page({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<missingReport | null>(null);
  const [dept, setDept] = useState<department | null>(null);  
  const [school, setSchool] = useState<School | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  const id = parseInt(params.id);
  const session = useSession();
  const email = session.data?.user?.email!;
  useEffect(() => {
    const handleSingleReport = async () => {
      try{
        setLoading(true)
        const singleReport = await fetchDepartmentSingleReport(id);
        if (singleReport) {
          setReport(singleReport.report);
          setDept(singleReport.dept);
          setSchool(singleReport.school);
          setStudent(singleReport.student ?? null);
        }
        setLoading(false)
      }catch(error){
        console.error('Error fetching single report:', error)
      }
    }
    handleSingleReport();
  }, [id])

  if (loading) return <Loader/>
  return (
    <div className='w-full h-full my-5'>
        <div className='w-1/2 mx-auto bg-white rounded-md'>
        <div className='m-2 p-3 grid grid-cols-2'>
            <Input
            id='FName'
            name='fullName'
            label='Full Name'
            type='text'
            required
            placeholder={student?.firstName + ' ' + student?.secondName}    
            disabled={true}
            />
            <Input
            id='RegNo'
            name='RegNo'
            label='Registration Number'
            type='text'
            required
            placeholder={student?.regNo || ''}
            disabled={true}
            />
            <Input
            id='School'
            name='School'
            label='School'
            type='text'
            required
            placeholder={school?.name || ''}
            disabled={true}
            />
            <Input
            id='Department'
            name='Department'
            label='Department'
            type='text'
            required
            placeholder={dept?.name || ''}
            disabled={true}
            />
            <Input
            id='AcademicYear'
            name='AcademicYear'
            label='Academic Year'
            type='text'
            required
            placeholder={report?.academicYear || ''}
            disabled={true}
            />
            <Input
            id='YearofStudy'
            name='YearofStudy'
            label='Year of Study'
            type='text'
            required
            placeholder={report?.yearOfStudy.toString() || ''}
            disabled={true}
            />
            <Input
            id='Semester'
            name='Semester'
            label='Semester'
            type='text'
            required
            placeholder={report?.semester || ''}
            disabled={true}
            />
            <Input
            id='ExamType'
            name='ExamType'
            label='Exam Type'
            type='text'
            required
            placeholder={report?.examType || ''}
            disabled={true}
            />
            <Input
            id='UName'
            name='UnitName'
            label='Unit Name'
            type='text'
            required
            placeholder={report?.unitName || ''}
            disabled={true}
            />
            <Input
            id='UCode'
            name='UnitCode'
            label='Unit Code'
            type='text'
            required
            placeholder={report?.unitCode || ''}
            disabled={true}
            />
            <Input
            id='LecName'
            name='LecName'
            label='Lecturer Name'
            type='text'
            required
            placeholder={report?.lecturerName || ''}
            disabled={true}
            />
        </div>
        </div>
    </div>
  )
}
