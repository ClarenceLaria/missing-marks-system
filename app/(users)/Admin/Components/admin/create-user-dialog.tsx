"use client";

import { Button } from "@/app/(users)/Admin/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/(users)/Admin/Components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(users)/Admin/Components/ui/form";
import { Input } from "@/app/(users)/Admin/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(users)/Admin/Components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
// import { UserType } from "@prisma/client";

const formSchema = z.object({
  fName: z.string().min(1, "First Name is required"),
  sName: z.string().min(1, "Second Name is required"),
  email: z.string().email("Invalid email address"),
  userType: z.enum(["ADMIN", "DEAN", "LECTURER", "STUDENT", "COD"]),
  school: z.string().min(1, "School is required"),
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

export function CreateUserDialog({ open }: CreateUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
      sName: "",
      email: "",
      userType: "STUDENT",
      school: "",
      regNo: "",
      phoneNumber: "",
    },
  });

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
                      <SelectItem value="computing">School of Computing</SelectItem>
                      <SelectItem value="engineering">School of Engineering</SelectItem>
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
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}