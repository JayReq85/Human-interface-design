
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useBookingContext } from "../context/BookingContext";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  stayPeriod: z.string({ required_error: "Please select your stay period." }),
  moveInDate: z.string({ required_error: "Please select a move-in date." }),
  additionalNote: z.string().optional(),
});

interface BookingRequestFormProps {
  propertyId: string;
  propertyName: string;
  onSuccess: () => void;
}

export default function BookingRequestForm({ propertyId, propertyName, onSuccess }: BookingRequestFormProps) {
  const { toast } = useToast();
  const { addBooking } = useBookingContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      stayPeriod: "",
      moveInDate: "",
      additionalNote: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Create new booking
    addBooking({
      propertyId,
      propertyName,
      name: values.name,
      phone: values.phone,
      stayPeriod: values.stayPeriod,
      moveInDate: values.moveInDate,
      additionalNote: values.additionalNote,
    });

    toast({
      title: "Booking Request Submitted",
      description: "We will notify you once the landlord responds to your request.",
    });

    // Call onSuccess to close dialog
    onSuccess();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Booking Request for {propertyName}</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stayPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stay Period</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stay period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="<6months">Less than 6 months</SelectItem>
                    <SelectItem value="6-12months">6-12 months</SelectItem>
                    <SelectItem value=">12months">More than 1 year</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="moveInDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Move-in Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="date" 
                      className="pl-9"
                      placeholder="Select date" 
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Note</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Anything else you'd like to mention to the landlord" 
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </Form>
    </>
  );
}
