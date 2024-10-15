'use client'
import Button from '@/app/Components/Button'
import Input from '@/app/Components/Input'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Page() {
    const [academicYear, setAcademicYear] = useState('2024/2025');
    const [yearOfStudy, setYearOfStudy] = useState('1');
    const [semester, setSemester] = useState('SEMESTER1');
    const [examType, setExamType] = useState('MAIN');
    const [unitCode, setUnitCode] = useState('BIT 313');
    const [unitName, setUnitName] = useState('WEBSYSTEMS AND TECHNOLOGIES II');
    const [lecturerName, setLecturerName] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleLoading = () => {
        setLoading((prevLoading) => !prevLoading);
      };
    const handleSubmit = async () => {
        const reportData = {
          academicYear,
          yearOfStudy,
          semester,
          examType,
          unitCode,
          unitName,
          lecturerName,
        }

        if(reportData.academicYear === ''|| reportData.academicYear===null || reportData.yearOfStudy === ''|| reportData.yearOfStudy===null || reportData.semester === ''|| reportData.semester===null || reportData.examType === ''|| reportData.examType===null || reportData.unitCode === ''|| reportData.unitCode===null || reportData.unitName===''|| reportData.unitName===null || reportData.lecturerName===''|| reportData.lecturerName===null){
            toggleLoading();
            toast.error('Please fill all the fields')
        }
        
        try {
          const response = await fetch('/api/createReport', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData),
          })
    
          if (response.ok) {
            toast.success('Missing mark submitted successfully')
          } else if(response.status === 400) {
            toast.error('Failed to submit report')
          } 
        } catch (error) {
          console.error('Error submitting report:', error)
        }
      console.log(reportData)

      }
  return (
    <div className='w-full h-full mx-10 my-5'>
        <h1 className='font-semibold text-2xl flex justify-center'>Make a Report over your missing mark</h1>
        <div className='grid grid-cols-3 w-full gap-y-10 my-10'>
            <div className='w-[18vw]'>
                <label>Select Academic Year</label><br/>
                <select 
                    className='my-2 w-[18vw] px-2 py-1 rounded' name="AcademicYear" id="AcademicYear" 
                    onChange={(e) => setAcademicYear(e.target.value)}
                >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2022/2023">2022/2023</option>
                    <option value="2021/2022">2021/2022</option>
                    <option value="2020/2021">2020/2021</option>
                    <option value="2019/2020">2019/2020</option>
                    <option value="2018/2019">2018/2019</option>
                    <option value="2017/2018">2017/2018</option>
                </select>
            </div>
            <div className='w-[18vw]'>
                <label>Select Year</label><br/>
                <select 
                    className='my-2 w-[18vw] px-2 py-1 rounded' name="YearOfStudy" id="YearOfStudy" 
                    onChange={(e) => setYearOfStudy(e.target.value)}
                >
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                </select>
            </div>
            <div className='w-[18vw]'>
                <label>Select Semester</label><br/>
                <select 
                    className='my-2 w-[18vw] px-2 py-1 rounded' name="Semester" id="Semester" 
                    onChange={(e) => setSemester(e.target.value)}
                >
                    <option value="SEMESTER1">SEMESTER 1</option>
                    <option value="SEMESTER2">SEMESTER 2</option>
                    <option value="SEMESTER3">SEMESTER 3</option>
                </select>
            </div>
            <div className='w-[18vw]'>
                <label>Select Exam Type</label><br/>
                <select 
                    className='my-2 w-[18vw] px-2 py-1 rounded' name="ExamType" id="ExamType" 
                    onChange={(e) => setExamType(e.target.value)}
                >
                    <option value="MAIN">MAIN EXAMS</option>
                    <option value="SPECIAL">SPECIAL EXAMS</option>
                    <option value="SUPLIMENTARY">SUPLIMENTARY EXAMS</option>
                </select>
            </div>
            <div className='w-[18vw]'>
                <label>Select Unit Code</label><br/>
                <select 
                    className='my-2 w-[18vw] px-2 py-1 rounded' name="UnitCode" id="UnitCode" 
                    onChange={(e) => setUnitCode(e.target.value)}
                >
                    <option value="BIT 313">BIT 313</option>
                    <option value="BIT 314">BIT 314</option>
                    <option value="BIT 316">BIT 316</option>
                    <option value="BIT 333">BIT 333</option>
                    <option value="BIT 317">BIT 317</option>
                    <option value="BIT 323">BIT 323</option>
                    <option value="BIT 311">BIT 311</option>
                </select>
            </div>
            <div className='w-[18vw]'>
                <label>Select Course Title</label><br/>
                <select 
                className='my-2 w-[18vw] px-2 py-1 rounded' name="UnitName" id="UnitName" 
                onChange={(e) => setUnitName(e.target.value)}
                >
                    <option value="WEBSYSTEMS AND TECHNOLOGIES II">WEBSYSTEMS AND TECHNOLOGIES II</option>
                    <option value="SOFTWARE ENGINEERING">SOFTWARE ENGINEERING</option>
                    <option value="OPERATIONS RESEARCH">OPERATIONS RESEARCH</option>
                    <option value="INFORMATION ASSSURANCE AND SECURITY I">INFORMATION ASSSURANCE AND SECURITY I</option>
                    <option value="INFORMATION MANAGEMENT">INFORMATION MANAGEMENT</option>
                    <option value="DATABASE MANAGEMENT">DATABASE MANAGEMENT</option>
                    <option value="NETWORK ADMIN AND MANAGEMENT">NETWORK ADMIN AND MANAGEMENT</option>
                </select>
            </div>
            <div className='w-[18vw]'> 
                <Input
                    id='lecturerName'
                    name='lecturerName'
                    label='Lecturer Name'
                    required
                    type='text'
                    placeholder='Enter Lecturer Name'
                    disabled={false}
                    onChange={(e) => setLecturerName(e.target.value)}
                />
            </div>
        </div>
        <div className='w-[15vw]'>
            <Button type='submit' fullWidth={true} onClick={() => handleSubmit()}  disabled={false}>Submit</Button>
        </div>
    </div>
  )
}
