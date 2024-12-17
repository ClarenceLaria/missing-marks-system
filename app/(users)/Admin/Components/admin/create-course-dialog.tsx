"use client";

import { Button } from "@/app/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/Components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/Components/ui/form";
import { Input } from "@/app/Components/ui/input";
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
import { CourseList } from "@/app/Components/lecturer/course-list";
import toast from "react-hot-toast";
import { fetchDepartmentsBySchoolId, fetchProgramsBySchoolId, fetchSchools } from "@/app/lib/actions";

const formSchema = z.object({
  code: z.string().min(1, "Course code is required"),
  name: z.string().min(1, "Course name is required"),
  school: z.string().min(1, "School is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  yearofStudy: z.string().min(1, "Year of study is required"),
  semester: z.string().min(1, "Semester is required"),
  programs: z.array(z.number()).min(1, "At least one Program is required"),
});

interface CreateCourseDialogProps {
  open: boolean;
}

interface School {
  id: number;
  name: string;
  abbreviation: string;
}
interface Department {
  name: string;
  id: number;
}
export function CreateCourseDialog({ open }: CreateCourseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [programs, setPrograms] = useState<Department[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      school: "",
      academicYear: "",
      yearofStudy: "",
      semester: "",
      programs: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsOpen(false);
    form.reset();
  }

  useEffect(() => {
    if (open) {
      setIsOpen(true);
    }
  }, [open]);

  useEffect(() => {
    const handleSchools = async () => {
      try{
        const schools = await fetchSchools();
        setSchools(schools || []);
      }catch(error){
        console.error('Error fetching schools: ',error);
      }
    };
    handleSchools();
  }, []);

  const schoolId = parseInt(form.watch('school'));
  useEffect(() => { 
    const handlePrograms = async () => {
      try{
        const departments = await fetchProgramsBySchoolId(schoolId);
        setPrograms(departments || []);
      }catch(error){
        console.error('Error fetching departments: ',error);
      }
    }; 
    handlePrograms();
  },[schoolId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/createCourse", {
        method: "POST",
        body: JSON.stringify({
          name: form.getValues("name"),
          code: form.getValues("code"),
          academicYear: form.getValues("academicYear"),
          yearofStudy: parseInt(form.getValues("yearofStudy")!),
          semester: form.getValues("semester"),
          courses: form.getValues("programs"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok && response.status === 200 || response.status === 201) {
        const result = await response.json();
        console.log(result);
        toast.success(result.message);
      } else {
        const error = await response.json();
        console.error(error);
        toast.error(error.error);
      }
    } catch (error) {
      console.error("An error occurred while creating course: ", error);
      toast.error("An error occurred while creating course");
    }
    finally{
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          <DialogDescription>Add a new course to the system</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="BCS 203" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Database Systems" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem value={school.id.toString()} key={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <SelectItem value="2024/2025">
                        2024/2025
                      </SelectItem>
                      <SelectItem value="2023/2024">
                        2023/2024
                      </SelectItem>
                      <SelectItem value="2022/2023">
                        2022/2023
                      </SelectItem>
                      <SelectItem value="2021/2022">
                        2021/2022
                      </SelectItem>
                      <SelectItem value="2020/2021">
                        2020/2021
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearofStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Study</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year of study" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">
                        Year 1
                      </SelectItem>
                      <SelectItem value="2">
                        Year 2
                      </SelectItem>
                      <SelectItem value="3">
                        Year 3
                      </SelectItem>
                      <SelectItem value="4">
                        Year 4
                      </SelectItem>
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
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SEMESTER1">
                        Semester 1
                      </SelectItem>
                      <SelectItem value="SEMESTER2">
                        Semester 2
                      </SelectItem>
                      <SelectItem value="SEMESTER3">
                        Semester 3
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="programs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program(s)</FormLabel>
                  <Select onValueChange={(value) => {
                    const currentSelection = field.value || [];
                    const newSelection = currentSelection.includes(parseInt(value))
                      ? currentSelection.filter((item) => item !== parseInt(value)) // Remove if already selected
                      : [...currentSelection, value]; // Add new selection
                    field.onChange(newSelection);
                  }} 
                  defaultValue={field.value[0]?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem value={program.id.toString()} key={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={isSubmitting} type="submit" onClick={() => handleSubmit()}>Create Course</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}