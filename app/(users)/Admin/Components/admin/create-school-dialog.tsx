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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "School name is required"),
  abbreviation: z.string().min(1, "School abbreviation is required"),
  deanEmail: z.string().email("Invalid email address"),
});

interface CreateSchoolDialogProps {
  open: boolean;
}

export function CreateSchoolDialog({ open }: CreateSchoolDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
      deanEmail: "",
    },
  });

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
          <DialogTitle>Create School</DialogTitle>
          <DialogDescription>
            Add a new school and assign a dean
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="School of Computing..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abbreviation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Abbreviation</FormLabel>
                  <FormControl>
                    <Input placeholder="SCI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deanEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dean&apos;s Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="dean@university.edu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create School</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}