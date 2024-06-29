import Button from '@/app/Components/Button'
import Input from '@/app/Components/Input'
import React from 'react'

export default function page() {
  return (
    <div className='w-full h-full mx-10 my-5'>
        <h1 className='font-semibold text-2xl flex justify-center'>Make a Report over your missing mark</h1>
        <div className='mx-auto w-[25vw]'>
            <Input
                id='FName'
                name='firstName'
                label='First Name'
                type='text'
                required
                placeholder='Enter First Name'
                disabled={false}
                value={''}
                // onChange={()=>{}}
            />
            <Input
                id='SName'
                name='secondName'
                label='Second Name'
                required
                type='text'
                placeholder='Enter Second Name'
                disabled={false}
                value={''}
                // onChange={()=>{}}
            />
            <Input
                id='regNo'
                name='registrationNumber'
                label='Registration Number'
                required
                type='text'
                placeholder='Enter Registration Number'
                disabled={false}
                value={''}
                // onChange={()=>{}}
            />
            <Input
                id='unitCode'
                name='unitCode'
                label='Unit Code'
                required
                type='text'
                placeholder='Enter Unit Code'
                disabled={false}
                value={''}
                // onChange={()=>{}}
            /> 
            <Input
                id='unitName'
                name='unitName'
                label='Unit Name'
                required
                type='text'
                placeholder='Enter Unit Name'
                disabled={false}
                value={''}
                // onChange={()=>{}}
            />
            <Input
                id='lecturerName'
                name='lecturerName'
                label='Lecturer Name'
                required
                type='text'
                placeholder='Enter Lecturer Name'
                disabled={false}
                value={''}
                // onChange={()=>{}}
            />
            <Input
                id='examPeriod'
                name='examPeriod'
                label='Exam Period'
                required
                type='text'
                placeholder='Enter Exam Period'
                disabled={false}
                value={''}
                // onChange={()=>{}}
            />
            <Input
                id='academicYear'
                name='academicYear'
                label='Academic Year'
                required
                type='text'
                placeholder='Enter Academic Year'
                disabled={false}
                value={''}
                // onChange={()=>{}}
            />
            <Button type='submit' fullWidth={true} /*onClick={()=>{}}*/disabled={false}>Submit</Button>
        </div>
    </div>
  )
}
