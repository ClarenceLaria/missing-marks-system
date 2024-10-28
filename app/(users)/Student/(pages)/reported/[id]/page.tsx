'use client'
import Input from '@/app/Components/Input'
import { fetchSingleReport } from '@/app/lib/actions';
import { ExamType, ReportStatus, Semester } from '@prisma/client';
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
export default function Page({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<missingReport | null>(null);
  const [dept, setDept] = useState<department | null>(null);
  const [school, setSchool] = useState(null);
  const [student, setStudent] = useState(null);

  const id = parseInt(params.id);
  const session = useSession();
  const email = session.data?.user?.email!;
console.log(email)
  useEffect(() => {
    const handleSingleReport = async () => {
      if (!email) {
        return console.error('Email is required');
      }
      try{
        setLoading(true)
        const singleReport = await fetchSingleReport(email, id);
        setReport(singleReport.report);
        // setDept(singleReport.dept)
        // setSchool(singleReport.school)
        // setStudent(singleReport.student);
        setLoading(false)
        toast.success('Report fetched successfully')
      }catch(error){
        console.error('Error fetching single report:', error)
        toast.error('Failed to fetch report')
      }
    }
    handleSingleReport();
  }, [id, email])
  console.log(report?.id)
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
            placeholder='Clarence Laria'
            disabled={true}
            />
            <Input
            id='RegNo'
            name='RegNo'
            label='Registration Number'
            type='text'
            required
            placeholder='SIT/B/01-02287/2021'
            disabled={true}
            />
            <Input
            id='School'
            name='School'
            label='School'
            type='text'
            required
            placeholder='School of Computing and Informatics'
            disabled={true}
            />
            <Input
            id='Department'
            name='Department'
            label='Department'
            type='text'
            required
            placeholder='Information Technology'
            disabled={true}
            />
            <Input
            id='AcademicYear'
            name='AcademicYear'
            label='Academic Year'
            type='text'
            required
            placeholder='2023/2024'
            disabled={true}
            />
            <Input
            id='YearofStudy'
            name='YearofStudy'
            label='Year of Study'
            type='text'
            required
            placeholder='Year 1'
            disabled={true}
            />
            <Input
            id='Semester'
            name='Semester'
            label='Semester'
            type='text'
            required
            placeholder='Semester 1'
            disabled={true}
            />
            <Input
            id='ExamPeriod'
            name='ExamPeriod'
            label='Exam Period'
            type='text'
            required
            placeholder='December'
            disabled={true}
            />
            <Input
            id='UName'
            name='UnitName'
            label='Unit Name'
            type='text'
            required
            placeholder='Introduction To Programming'
            disabled={true}
            />
            <Input
            id='UCode'
            name='UnitCode'
            label='Unit Code'
            type='text'
            required
            placeholder='BCS 110'
            disabled={true}
            />
            <Input
            id='LecName'
            name='LecName'
            label='Lecturer Name'
            type='text'
            required
            placeholder='Dr. Raphael Angulu'
            disabled={true}
            />
        </div>
        </div>
    </div>
  )
}
