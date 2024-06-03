// Transaction.tsx
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
import { format } from "date-fns";
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

// フォームのスキーマを定義
const formSchema = z.object({
  date: z.date().nullable().optional(), // 日付はnullもしくは未定義が許容される
  category: z.string().min(2).max(50), // カテゴリは2文字以上50文字以下
  amount: z.preprocess((val) => parseFloat(val as string), z.number()), // 金額は数値に変換してから数値として扱う
  type: z.enum(["Income", "Expense"]), // タイプは "Income" か "Expense"
  content: z.string().max(50), // 内容は最大50文字
});

// カテゴリーの定義
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
  const { user, addTransaction, fetchTransactions } = useStore(); // グローバルストアから必要な関数とデータを取得
  const [login, setLogin] = useState(false); // ログイン状態を管理
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // カレンダーの表示状態を管理
  const [categories, setCategories] = useState<string[]>(incomeCategories); // カテゴリーを状態として管理

  useEffect(() => {
    if (user.id) {
      setLogin(true); // ユーザーIDが存在する場合、ログイン状態をtrueにする
    }
  }, [user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Zodスキーマをバリデーションに使用
    defaultValues: {
      date: undefined,
      category: "",
      type: undefined,
      amount: 0,
      content: "",
    },
  });

  // フォームのフィールドが変更されたときにカテゴリーを更新する
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

  // フォームの送信処理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!login) {
      throw new Error("ログインしてください");
    }

    // 日付のフォーマットを修正
    const formattedDate = values.date ? format(values.date, "yyyy-MM-dd") : null;

    const transaction = {
      date: formattedDate,
      category: values.category,
      amount: values.amount,
      type: values.type,
      content: values.content,
      user_id: user.id, // ユーザーIDを含める
    };

    // トランザクションをデータベースに挿入
    const { data, error: insertError } = await supabase
      .from("transactions")
      .insert([transaction])
      .single();
    if (insertError) {
      console.error("Error inserting transaction:", insertError);
    } else {
      console.log("Transaction successfully inserted:");
      alert("Transaction successfully submitted!");
      addTransaction(data); // 新しいトランザクションをグローバルステートに追加
      await fetchTransactions(user.id); // 最新のトランザクションをユーザーIDでフェッチ
      form.reset(); // フォームをリセット
    }
  }

  return (
    <section className="p-10">
      <Title title="Transaction" /> {/* タイトルを表示 */}
      <div className="mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
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
                        <SelectValue placeholder="Select type" />
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
                      placeholder="0"
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
              className="w-full bg-buttonPrimary"
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
