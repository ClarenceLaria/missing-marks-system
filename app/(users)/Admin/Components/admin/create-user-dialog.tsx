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
import { fetchDepartments } from "@/app/lib/actions";
import toast from "react-hot-toast";
import dotenv from 'dotenv'
import { UserStatus } from "@prisma/client";
// import { UserType } from "@prisma/client";

const formSchema = z.object({
  fName: z.string().min(1, "First Name is required"),
  sName: z.string().min(1, "Second Name is required"),
  email: z.string().email("Invalid email address"),
  userType: z.enum(["ADMIN", "DEAN", "LECTURER", "STUDENT", "COD"]),
  department: z.string().min(1, "Department is required"),
  regNo: z.string().optional(),
  phoneNumber: z.string().optional(),
})
.refine((data) => {
  if (data.userType === "STUDENT") {
    return !!data.regNo; // Reg No is required for students
  }
  if (data.userType === "LECTURER" || data.userType === "ADMIN" || data.userType === "COD" || data.userType === "DEAN") {
    return !!data.phoneNumber; // Phone Number is required for lecturers, admins, cods and deans
  }
}, {
  message: "Reg No or Phone Number is required for the selected role",
  path: ["userType"], // Highlight the role field for validation errors
});

interface CreateUserDialogProps {
  open: boolean;
}

interface Department {
  name: string;
    id: number;
}

export function CreateUserDialog({ open }: CreateUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setisLoading] = useState(false);
  
  const toggleLoading = () => {
    setisLoading((prevLoading) => !prevLoading);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
      sName: "",
      email: "",
      userType: "STUDENT",
      department: "",
      regNo: "",
      phoneNumber: "",
    },
  });

  dotenv.config();
  const email = form.getValues('email');
  const regNo = form.getValues('regNo')!;
  const status = 'active';

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/; //This rejects emails like 123@gmail.com and accepts emails like example123@gmail.com, all emails must be lowercase
    return emailRegex.test(email);
  };

  const validateRegistrationNumber = (regNo: string) => {
    const pattern = /^[A-Z]{3}\/B\/\d{2}-\d{5}\/\d{4}$/;
    return pattern.test(regNo);
  };
  const selectedType = form.watch('userType');
  useEffect(() => {
    if (open) {
      setIsOpen(true);
    }
  }, [open]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsOpen(false);
    form.reset();
  }

  useEffect(() => {
    const handleDepartments = async () => {
      try{
        const departments = await fetchDepartments();
        setDepartments(departments || []);
      }catch(error){
        console.error("Error fetching Departments:", error)
      };
    };
    handleDepartments();
  },[]);

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      toggleLoading();
      toast.error('Please enter a valid email address');
      return;
    }
    if(selectedType === 'STUDENT'){
    try{
      if (!validateRegistrationNumber(regNo)) {
        toast.error('Please enter a valid registration number');
        return;
      }

      try{
        toast.loading("Sending request...");

        const response = await fetch('/api/registerUser', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            firstName: form.getValues('fName'),
            secondName: form.getValues('sName'),
            email,
            password: process.env.NEXT_PUBLIC_USER_SECRET!,
            registrationNumber: regNo,
            userType: selectedType,
            // departmentId: parseInt(form.getValues('department')!),
          }),
        });

        toast.dismiss();

        // Check response status and act accordingly
        if (response.ok && response.status === 200 || response.status === 201) {
          toast.success('User Registered Successfully');
        } else if (response.status === 400) {
          const errorData = await response.json();
          toast.error(errorData.error);
        } else if (response.status === 409) {
          toast.error('User with these credentials already exists');
        } else {
          toast.error('Unexpected error occurred');
        }
      }catch(error){
        toast.dismiss();
        toast.error('Failed to send request. Please try again.');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Something went wrong');
    } finally {
      toggleLoading();
    }
  };
  if(selectedType === 'ADMIN' || selectedType === 'DEAN' || selectedType === 'COD' || selectedType === 'LECTURER'){
    try{
      toast.loading("Sending request...");

      const response = await fetch('/api/registerStaff', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.getValues('fName'),
          secondName: form.getValues('sName'),
          email,
          password: process.env.NEXT_PUBLIC_USER_SECRET!,
          phoneNumber: form.getValues('phoneNumber'),
          userType: selectedType,
          userStatus: status,
          departmentId: parseInt(form.getValues('department')!),
        }),
      });

      toast.dismiss();

      // Check response status and act accordingly
      if (response.ok && response.status === 200 || response.status === 201) {
        toast.success(`${selectedType} Registered Successfully`);
      } else if (response.status === 400) {
        const errorData = await response.json();
        toast.error(errorData.error);
      } else if (response.status === 409) {
        toast.error('User with these credentials already exists');
      } else {
        toast.error('Unexpected error occurred');
      }
    }catch(error){
      console.error('Error creating user:', error);
    }finally{
      toggleLoading();
  }
  };
};

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Add a new user to the system
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Second Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@university.edu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="DEAN">Dean</SelectItem>
                      <SelectItem value="COD">Cod</SelectItem>
                      <SelectItem value="LECTURER">Lecturer</SelectItem>
                      <SelectItem value="STUDENT">Student</SelectItem>
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
                        <SelectItem key={department.id} value={department.id.toString()}>{department.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedType === 'STUDENT' && (
            <FormField
              control={form.control}
              name="regNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reg No</FormLabel>
                  <FormControl>
                    <Input placeholder="SIT/B/01-00000/2009" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />)}
            {(selectedType === 'LECTURER' || selectedType === 'ADMIN' || selectedType === 'COD' || selectedType === 'DEAN') && (
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone No</FormLabel>
                  <FormControl>
                    <Input placeholder="0700000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />)}
            <DialogFooter>
              <Button type="submit" onClick={() => handleSubmit()}>Create User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}