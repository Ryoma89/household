'use client'
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import useStore from "@/store";
import Title from "@/app/components/elements/Title";
import BalanceCard from "@/app/components/elements/BalanceCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrencySymbol } from "@/constants/currencies";

// 現在の年と月を取得する関数
const getCurrentYearMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const BalanceSheet = () => {
  const { user, transactions } = useStore(); // グローバルストアからユーザーとトランザクションデータを取得
  const [income, setIncome] = useState(0); // 収入の状態を管理
  const [expense, setExpense] = useState(0); // 支出の状態を管理
  const [selectedMonth, setSelectedMonth] = useState(getCurrentYearMonth()); // 選択された月の状態を管理

  // トランザクションを基に収入と支出を計算する関数
  const calculateBalance = useCallback(() => {
    if (transactions) {
      // 選択された月のトランザクションのみをフィルタリング
      const filteredTransactions = transactions.filter(transaction => 
        transaction !== null && transaction !== undefined &&
        transaction.date.startsWith(selectedMonth)
      );
      // 収入の合計を計算（変換された金額を使用）
      const incomeSum = filteredTransactions
        .filter((transaction) => transaction.type === "Income")
        .reduce((sum, transaction) => sum + Number(transaction.converted_amount), 0);
      // 支出の合計を計算（変換された金額を使用）
      const expenseSum = filteredTransactions
        .filter((transaction) => transaction.type === "Expense")
        .reduce((sum, transaction) => sum + Number(transaction.converted_amount), 0);
      
      setIncome(incomeSum);
      setExpense(expenseSum);
    }
  }, [transactions, selectedMonth]);

  // トランザクションデータが変更されたときに収入と支出を再計算
  useEffect(() => {
    calculateBalance();
  }, [transactions, calculateBalance]);

  const balance = income - expense; // バランスを計算

  // 1年間の月を生成
  const months = Array.from({ length: 12 }, (_, i) => {
    const year = new Date().getFullYear();
    const month = String(i + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  return (
    <section className="p-10">
      <Title title="Balance Sheet" /> {/* タイトルを表示 */}
      <div className="flex justify-center items-center mb-5 mt-10">
        <Select onValueChange={(value) => setSelectedMonth(value)} value={selectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{selectedMonth}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <BalanceCard 
        income={income} 
        expense={expense} 
        balance={balance} 
        currencySymbol={getCurrencySymbol(user.primary_currency)}
      /> {/* 収入、支出、バランスを表示 */}
    </section>
  );
};

export default BalanceSheet;
