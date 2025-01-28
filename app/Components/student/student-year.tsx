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
import toast from "react-hot-toast";

const formSchema = z.object({
  year: z.string().min(1, "Year of Study is required"),
});

interface DeleteSchoolDialogProps {
  open: boolean;
}

export function SetYearDialog({ open}: DeleteSchoolDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: "",
    },
  });

  const year = form.watch('year');

  useEffect(() => {
    if (open) {
      setIsOpen(true);
    }
  }, [open]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsOpen(false);
    form.reset();
  }

  const handleSubmit = async () => {
    try{
      toast.loading("Sending request...");

      const response = await fetch('/api/setYear', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({year: parseInt(year)})
      });

      toast.dismiss();

      if (response.ok && response.status === 200) {
        toast.success('User Year of study set successfully');
      } else if (response.status === 400) {
        const errorData = await response.json();
        toast.error(errorData.error);
        setIsOpen(true);
      } else {
        toast.error('Unexpected error occurred');
        setIsOpen(true);
      }
    }catch(error){
      toast.error("Failed to send request. Please try again.");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Year of Study</DialogTitle>
          <DialogDescription>
            Add year of study
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Year of Study</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Your Current Year Of Study" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">YEAR 1</SelectItem>
                      <SelectItem value="2">YEAR 2</SelectItem>
                      <SelectItem value="3">YEAR 3</SelectItem>
                      <SelectItem value="4">YEAR 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="bg-primary items-center" onClick={() => handleSubmit()}>Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}