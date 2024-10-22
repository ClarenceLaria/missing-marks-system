'use client'
import Button from '@/app/Components/Button'
import Input from '@/app/Components/Input'
import { fetchUnits } from '@/app/lib/actions'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Page() {
    const [academicYear, setAcademicYear] = useState('2024/2025');
    const [yearOfStudy, setYearOfStudy] = useState('1');
    const [semester, setSemester] = useState('SEMESTER1');
    const [examType, setExamType] = useState('MAIN');
    const [selectedUnitCode, setSelectedUnitCode] = useState('');
    const [selectedUnitName, setSelectedUnitName] = useState('');
    const [lecturerName, setLecturerName] = useState('');
    const [loading, setLoading] = useState(false);
    interface Unit {
        id: number;
        name: string;
        code: string;
        academicYear: string;
        yearOfStudy: number;
        semester: string; // Assuming Semester is a string, adjust if it's an enum or other type
        lecturerId: number;
    }

    const [units, setUnits] = useState<Unit[]>([]);

    const session = useSession();
    const email = session.data?.user?.email!; 
    const handleFetchUnits = async () => {  
        try{
            const year = parseInt(yearOfStudy);
            toggleLoading();
            const fetchedUnits = await fetchUnits(email, academicYear, year, semester);
            setUnits(fetchedUnits);
            toast.success('Units fetched successfully')
            
        }
        catch(error){
            console.error('Error fetching units:', error)
            toast.error('Failed to fetch units')
        }
        finally{
            toggleLoading();
        }
    }
    console.log(units)
    useEffect(() => {
        if(academicYear && yearOfStudy && semester){
            handleFetchUnits();
        }
    }, [handleFetchUnits, academicYear, yearOfStudy, semester])
    const toggleLoading = () => {
        setLoading((prevLoading) => !prevLoading);
      };
    const handleSubmit = async () => {
        const reportData = {
          academicYear,
          yearOfStudy,
          semester,
          examType,
          unitCode: selectedUnitCode,
          unitName: selectedUnitName,
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


    useEffect(() => {
        const selectedUnit = units.find(unit => unit.code === selectedUnitCode);
        if (selectedUnit) {
            setSelectedUnitName(selectedUnit.name);
        } else {
            setSelectedUnitName('');
        }
    }, [selectedUnitCode, units]);
    useEffect(() => {
        const selectedUnit = units.find(unit => unit.name === selectedUnitName);
        if(selectedUnit){
            setSelectedUnitCode(selectedUnit.code);
        } else {
            setSelectedUnitCode("")
        }
    }, [selectedUnitName, units])

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
                    value={selectedUnitCode}
                    onChange={(e) => setSelectedUnitCode(e.target.value)}
                >
                    <option value="">-- Select Unit Code --</option>
                    {units.map((unit) => (
                        <option key={unit.id} value={unit.code}>{unit.code}</option>
                    ))}
                </select>
            </div>
            <div className='w-[18vw]'>
                <label>Select Course Title</label><br/>
                <select 
                className='my-2 w-[18vw] px-2 py-1 rounded' name="UnitName" id="UnitName" 
                value={selectedUnitName}
                onChange={(e) => setSelectedUnitName(e.target.value)}
                >
                    <option value="">-- Select Course Title --</option>
                    {units.map((unit) => (
                        <option key={unit.id} value={unit.name}>{unit.name}</option>
                    ))}
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
