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
import { fetchUniversityUsers } from "@/app/lib/actions";
import { UserStatus, UserType } from "@prisma/client";
import toast from "react-hot-toast";

const formSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  lecturer: z.string().min(1, "Lecturer is required"),
});

interface AssignCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: {
    id: number;
    code: string;
    name: string;
    academicYear: string;
  } | null;
}

interface Lecturer {
  id: number;
  departmentId: number;
  schoolId: number;
  createdAt: Date;
  email: string;
  firstName: string;
  secondName: string;
  password: string;
  userType: UserType;
  userStatus: UserStatus;
  phoneNumber: string;
}
export function AssignCourseDialog({
  open,
  onOpenChange,
  course,
}: AssignCourseDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      academicYear: "",
      lecturer: "",
    },
  });
  const [lecturers, setLecturers] = useState<Lecturer []>([]);

  const lecturerId = parseInt(form.getValues("lecturer")!);
  const academicYear = course?.academicYear;

  function onSubmit(values: z.infer<typeof formSchema>) {
    onOpenChange(false);
    form.reset();
  }

  useEffect(() => {
    const handleLecturers = async () => {
      try {
        const lecturers = await fetchUniversityUsers();
        setLecturers(lecturers?.lecturers || []);
      } catch (error) {
        console.error("Error fetching lecturers: ", error);
      }
    };
    handleLecturers();
  },[]);

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/assignLecturer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unitId: course?.id,
          lecturerId,
          academicYear,
        }),
      });
      
      if(response.ok && response.status === 200){
        const data = await response.json();
        toast.success(data.message);
      } else {
        const error = await response.json();
        console.error("Error assigning lecturer to course: ", error);
        toast.error(error.error);
      }

    } catch (error) {
      console.error("Error assigning lecturer to course: ", error);
      toast.error("An error occurred while assigning lecturer to course");
    }
  }

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Course</DialogTitle>
          <DialogDescription>
            Assign {course.code} - {course.name} to a lecturer
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
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
                      {lecturers.map((lecturer) => (
                        <SelectItem key={lecturer.id} value={(lecturer.id).toString()}>
                          {lecturer.firstName} {lecturer.secondName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" onClick={() => handleSubmit()}>Assign Course</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}