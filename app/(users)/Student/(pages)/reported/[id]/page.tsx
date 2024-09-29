import Input from '@/app/Components/Input'
import React, { useState } from 'react'

export default function page({ params }: { params: { id: string } }) {
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
