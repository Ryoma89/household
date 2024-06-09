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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "@/store";
import { supabase } from "@/utils/supabase";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

// フォームのスキーマを定義
const formSchema = z.object({
  month: z.string().min(7).max(7), // yyyy-MM 形式の月
  amount: z.preprocess((val) => parseFloat(val as string), z.number()),
});

const BudgetInput = () => {
  const { user, selectedMonth, fetchUserProfile, fetchBudgetAmount } = useStore();
  const [login, setLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // モーダルの表示状態を管理

  // ユーザーのログイン状態を監視し、プロフィールを取得
  useEffect(() => {
    if (user.id) {
      setLogin(true);
      fetchUserProfile(user.id);
    }
  }, [user.id, fetchUserProfile]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: selectedMonth,
      amount: 0,
    },
  });

  // フォーム送信処理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!login) {
      throw new Error("ログインしてください");
    }

    // 既存のデータをチェック
    const { data: existingBudgets, error: fetchError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', values.month);

    if (fetchError) {
      console.error("Error fetching existing budgets:", fetchError);
      return;
    }

    // 既存データがある場合は更新し、ない場合は新規作成
    if (existingBudgets && existingBudgets.length > 0) {
      const { error: updateError } = await supabase
        .from('budgets')
        .update({
          amount: values.amount,
          currency: user.primary_currency,
          updated_at: new Date(),
        })
        .eq('id', existingBudgets[0].id);

      if (updateError) {
        console.error("Error updating budget:", updateError);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('budgets')
        .insert([
          {
            user_id: user.id,
            month: values.month,
            amount: values.amount,
            currency: user.primary_currency,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);

      if (insertError) {
        console.error("Error inserting budget:", insertError);
        return;
      }
    }

    console.log("Budget operation completed successfully");
    await fetchBudgetAmount(); // データをフェッチ
    setIsOpen(false); // モーダルを閉じる
  }

  // 1年間の月を生成
  const months = Array.from({ length: 12 }, (_, i) => {
    const year = new Date().getFullYear();
    const month = String(i + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  return (
    <div className="mt-10">
      <div className="flex justify-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-buttonPrimary text-white rounded-lg p-2 w-[180px]"
              onClick={() => setIsOpen(true)}
            >
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="xs:w-4/5 xxs:w-9/12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* 月の選択 */}
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem className="xs:flex xs:items-center xs:space-x-4">
                      <FormLabel className="min-w-[80px] text-lg text-bold">
                        Month
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Primary Currencyの表示 */}
                <FormItem className="xs:flex xs:items-center xs:space-x-4">
                  <FormLabel className="min-w-[80px] text-lg text-bold">
                    Currency
                  </FormLabel>
                  <p>{user.primary_currency}</p>
                </FormItem>
                {/* 金額の入力 */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="xs:flex xs:items-center xs:space-x-4">
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
                <Button type="submit" className="w-full bg-buttonPrimary">
                  Submit
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BudgetInput;
