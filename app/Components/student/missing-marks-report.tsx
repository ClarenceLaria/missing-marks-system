"use client";

import { Button } from "@/app/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/Components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/Components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/Components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { fetchLecDetails, fetchStudentProfile, fetchUnits } from "@/app/lib/actions";
import toast from "react-hot-toast";
import { UserType } from "@prisma/client";

const formSchema = z.object({
  academicYear: z.string(),
  course: z.string(),
  examType: z.string(),
  semester: z.string(),
  yearOfStudy: z.string(),
});

interface Unit {
  id: number;
  name: string;
  code: string;
  academicYear: string;
  yearOfStudy: number;
  semester: string; // Assuming Semester is a string, adjust if it's an enum or other type
  lecturerId: number;
  lecturer: {
    id: number;
    firstName: string;
    secondName: string;
    phoneNumber: string;
};
}
interface Lecturer {
  id: number;
  createdAt: Date;
  email: string;
  firstName: string;
  secondName: string;
  phoneNumber: string;
  password: string;
  userType: UserType;
  departmentId: number;
};
interface Student {
  id: number;
  createdAt: Date;
  email: string;
  firstName: string;
  secondName: string;
  password: string;
  regNo: string;
  departmentId: number;
  courseId: number;
  userType: UserType;
}
export function MissingMarksReport() {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const toggleLoading = () => {
    setLoading((prevLoading) => !prevLoading);
  };
  
  const yearOfStudy = form.watch('yearOfStudy');
  const academicYear = form.watch('academicYear');
  const semester = form.watch('semester'); 
  const selectedUnit = form.watch('course');
  const unitMap = units.find((unit) => unit.code === selectedUnit);
  const lecId = unitMap ? unitMap.lecturerId : null;
  const lecName = unitMap ? unitMap.lecturer.firstName + ' ' + unitMap?.lecturer.secondName : null;
  const lecPhoneNo = unitMap ? unitMap.lecturer.phoneNumber : null;
  const unitName = unitMap ? unitMap.name : null;
  const unitId = unitMap ? unitMap.id : null;


  const message = `Dear ${lecturer?.firstName + ' ' + lecturer?.secondName}, \nA missing marks report has been submitted by: \n${student?.firstName + " " + student?.secondName}, (Reg No: ${student?.regNo}). \nDetails: \nYear of Study: ${yearOfStudy} \nAcademic Year: ${academicYear} \nUnit Name: ${unitName} \nUnit Code: ${form.getValues('course')}. \nPlease review the report at your earliest convenience. \nThank you.`;
  function formatPhoneNumber(phoneNumber: string): string | null {
    // Ensure the phone number starts with "0" and is followed by 9 digits
    const phoneRegex = /^0\d{9}$/;
  
    if (phoneRegex.test(phoneNumber)) {
      // Replace the leading "0" with "+254"
      return phoneNumber.replace(/^0/, '+254');
    } else {
      console.error('Invalid phone number format');
      return null;
    }
  }
  const formattedPhoneNo = formatPhoneNumber(lecPhoneNo!);


  useEffect(() => {
    const handleFetchUnits = async () => {  
        try{
            const year = parseInt(yearOfStudy);
            toggleLoading();
            const fetchedUnits = await fetchUnits(academicYear, year, semester);
            setUnits(fetchedUnits);
            toast.success('Units fetched ')
            
        }
        catch(error){
            console.error('Error fetching units:', error)
            toast.error('Failed to fetch units')
        }
        finally{
            toggleLoading();
        }
    }
    if(academicYear && yearOfStudy && semester){
        handleFetchUnits();
    }
  }, [academicYear, yearOfStudy, semester]);

  const handleSubmit = async () => {
    const reportData = {
      academicYear,
      yearOfStudy,
      semester,
      examType: form.getValues('examType'),
      unitCode: form.getValues('course'),
      unitName: unitName,
      lecturerName: lecName,
      unitId,
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
            try{
                const smsResponse = await fetch('/api/send-sms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phoneNo: formattedPhoneNo,
                        message: message,
                    }),
                });
                if (smsResponse.ok) {
                    const data = await smsResponse.json();
                    console.log('SMS sent successfully:', data);
                } else {
                    const errorData = await smsResponse.json();
                    console.error('Failed to send SMS', errorData.error);
                }
            }catch(error){
                console.error('Error sending SMS:', error);
            }
      } else if(response.status === 400) {
        toast.error('Failed to submit report')
      } 
    } catch (error) {
      console.error('Error submitting report:', error)
    }
  console.log(reportData)

  }

  useEffect(() => {
          const handleFetchPhoneNo = async () => {
              try{
                  if (lecId !== null) {
                      const lecturer = await fetchLecDetails(lecId);
                      if (lecturer) {
                          setLecturer(lecturer);
                      }
                  }
              }catch(error){
                  console.error("Error fetching phone number: ", error)
              };
          }
          handleFetchPhoneNo();
  },[lecId]);

  useEffect(() => {
          const handlefetchStudent = async () => {
              try{
                  setLoading(true);
                  const student = await fetchStudentProfile();
                  if(student){
                      setStudent(student);
                  }
                  setLoading(false);
              } catch(error){
                  console.error("Error fetching student: ", error)
              }
          };
          handlefetchStudent();
  },[]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Missing Marks</CardTitle>
        <CardDescription>Submit a new missing marks report</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                      <SelectItem value="2023/2024">2023/2024</SelectItem>
                      <SelectItem value="2022/2023">2022/2023</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Year</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SEMESTER1">SEMESTER 1</SelectItem>
                      <SelectItem value="SEMESTER2">SEMESTER 2</SelectItem>
                      <SelectItem value="SEMESTER3">SEMESTER 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="examType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Exam Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MAIN">MAIN EXAMS</SelectItem>
                      <SelectItem value="SPECIAL">SPECIAL EXAMS</SelectItem>
                      <SelectItem value="SUPPLIMENTARY">SUPPLIMENTARY EXAMS</SelectItem>
                      <SelectItem value="CAT">CAT</SelectItem>
                      <SelectItem value="MAIN_AND_CAT">MAIN EXAMS AND CAT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.code}>
                          {unit.code} - {unit.name}
                        </SelectItem>
                      ))}
                      {/* <SelectItem value="BCS203">BCS 203 - Database Systems</SelectItem>
                      <SelectItem value="BCS204">BCS 204 - Software Engineering</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="lecturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lecturer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lecturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="js">Dr. Jane Smith</SelectItem>
                      <SelectItem value="jd">Prof. John Doe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Button type="submit" onClick={() => handleSubmit()} className="w-full">Submit Report</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}