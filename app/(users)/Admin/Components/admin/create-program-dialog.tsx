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
import { fetchDepartmentsBySchoolId, fetchSchools } from "@/app/lib/actions";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  school: z.string().min(1, "School is required"),
  department: z.string().min(1, "Department is required"),
});

interface CreateCourseDialogProps {
  open: boolean;
}

interface School {
    id: number;
    name: string;
    abbreviation: string;
};
interface Department {
    id: number;
    name: string;
    schoolId: number;
};
export function CreateProgramDialog({ open }: CreateCourseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      school: "",
      department: "",
    },
  });

  const schoolId = parseInt(form.watch('school'));
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
  },[]);

  useEffect(() => {
    const handleDepartments = async () => {
        try{
            const departments = await fetchDepartmentsBySchoolId(schoolId);
            setDepartments(departments || []);
        }catch(error){
            console.error('Error fetching departments: ',error);
        }
    }; 
    handleDepartments();
  },[schoolId]);
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

  const deptId = parseInt(form.getValues('department')!);
  const programName = form.getValues('name');
  console.log(deptId, programName);
  const handleSubmit = async () => {
    try {
      toast.loading('Sending Request...');
      const response = await fetch('/api/createProgram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            name: programName,
            departmentId: deptId,
          }
        ),
      });

      toast.dismiss();

      if(response.ok && response.status === 200 || response.status === 201){
        const data = await response.json();
        console.log(data);
        toast.success(data.message);
      } else if (response.status === 400){
        const errorData = await response.json();
        toast.error(errorData.error);
      } else {
        toast.error('Failed to create program');
      }

    } catch (error){
      console.error('Error creating program: ', error);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Bsc. Information Technology" {...field} />
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
                            <SelectItem key={school.id} value={(school.id).toString()}>
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
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {departments.map((department) => (
                            <SelectItem key={department.id} value={(department.id).toString()}>
                                {department.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" onClick={() => handleSubmit()}>Create Program</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}