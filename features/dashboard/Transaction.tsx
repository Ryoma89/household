"use client";
import Title from "@/app/components/elements/Title";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "@/store";
import { supabase } from "@/utils/supabase";
import { ExpenseCategory, IncomeCategory } from "@/types/transaction";

const formSchema = z.object({
  date: z.date().nullable().optional(),
  category: z.string().min(2).max(50),
  amount: z.preprocess((val) => parseFloat(val as string), z.number()),
  type: z.enum(["Income", "Expense"]),
  content: z.string().max(50),
});

const incomeCategories: IncomeCategory[] = [
  "salary",
  "allowance",
  "rent",
  "stock",
  "investment",
];
const expenseCategories: ExpenseCategory[] = [
  "food",
  "daily",
  "rent",
  "enjoy",
  "entertainment",
  "transportation",
];

const Transaction = () => {
  const { user, addTransaction } = useStore();
  const [login, setLogin] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(incomeCategories);

  useEffect(() => {
    if (user.id) {
      setLogin(true);
    }
  }, [user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      category: "",
      amount: 0,
      type: "Income",
      content: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type") {
        setCategories(
          value.type === "Income" ? incomeCategories : expenseCategories
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!login) {
      throw new Error("ログインしてください");
    }

    const transaction = {
      date: values.date ? format(values.date, "yyyy-MM-dd") : null,
      category: values.category,
      amount: values.amount,
      type: values.type,
      content: values.content,
      user_id: user.id,
    };

    const { data, error: insertError } = await supabase
      .from("transactions")
      .insert([transaction])
      .single();
    if (insertError) {
      console.error("Error inserting transaction:", insertError);
    } else {
      console.log("Transaction successfully inserted:");
      alert("Transaction successfully submitted!");
      addTransaction(data); // Add the new transaction to the global state
      form.reset();
    }
  }

  return (
    <section className="p-10">
      <Title title="Transaction" />
      <div className="mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-5"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-4">
                  <FormLabel className="min-w-[80px] text-lg text-bold">
                    Type
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Income or Expense" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-4">
                  <FormLabel className="min-w-[80px] text-lg text-bold">
                    Category
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-4">
                  <FormLabel className="min-w-[80px] text-lg text-bold">
                    Date
                  </FormLabel>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-4">
                  <FormLabel className="min-w-[80px] text-lg text-bold">
                    Amount
                  </FormLabel>
                  <FormControl className="mt-0">
                    <Input
                      placeholder="Enter amount"
                      {...field}
                      className="mt-0"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-4">
                  <FormLabel className="min-w-[80px] text-lg text-bold">
                    Content
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-mainColor hover:bg-subColor"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default Transaction;
