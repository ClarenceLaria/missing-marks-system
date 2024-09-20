import Button from '@/app/Components/Button'
import Input from '@/app/Components/Input'
import React from 'react'

export default function page() {
  return (
    <div className='w-full h-full mx-10 my-5'>
        <h1 className='font-semibold text-2xl flex justify-center'>Make a Report over your missing mark</h1>
        {/* <div className='mx-auto w-[25vw]'> */}
        <div className='grid grid-cols-3 w-full gap-y-10 my-10'>
            <div className='w-[18vw]'>
                <label>Select Academic Year</label><br/>
                <select className='my-2 w-[18vw] px-2 py-1 rounded' name="cars" id="cars" >
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
                <label>Select Semester</label><br/>
                <select className='my-2 w-[18vw] px-2 py-1 rounded' name="cars" id="cars" >
                    <option value="SEMESTER1">SEMESTER 1</option>
                    <option value="SEMESTER2">SEMESTER 2</option>
                    <option value="SEMESTER3">SEMESTER 3</option>
                </select>
            </div>
            <div className='w-[18vw]'>
                <Input
                    id='examPeriod'
                    name='examPeriod'
                    label='Exam Period'
                    required
                    type='text'
                    placeholder='Enter Exam Period e.g April'
                    disabled={false}
                    value={''}
                    // onChange={()=>{}}
                />
            </div>
            <div className='w-[18vw]'>
                <label>Select Unit Code</label><br/>
                <select className='my-2 w-[18vw] px-2 py-1 rounded' name="cars" id="cars" >
                    <option value="BIT313">BIT 313</option>
                    <option value="BIT314">BIT 314</option>
                    <option value="BIT316">BIT 316</option>
                    <option value="BIT333">BIT 333</option>
                    <option value="BIT317">BIT 317</option>
                    <option value="BIT323">BIT 323</option>
                    <option value="BIT311">BIT 311</option>
                </select>
            </div>
            <div className='w-[18vw]'> 
                <Input
                    id='unitName'
                    name='unitName'
                    label='Unit Name'
                    required
                    type='text'
                    placeholder='Websystems and Technologies II'
                    disabled={false}
                    value={''}
                    // onChange={()=>{}}
                    />
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
                    value={''}
                    // onChange={()=>{}}
                />
            </div>
        </div>
        <div className='w-[15vw]'>
            <Button type='submit' fullWidth={true} /*onClick={()=>{}}*/disabled={false}>Submit</Button>
        </div>
    </div>
  )
}
