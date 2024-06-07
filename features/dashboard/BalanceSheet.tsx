"use client";
import React, { useEffect, useState, useCallback } from "react";
import useStore from "@/store";
import Title from "@/app/components/elements/Title";
import BalanceCard from "@/app/components/elements/BalanceCard";
import { getCurrencySymbol } from "@/constants/currencies";
import SelectMonth from "@/app/components/elements/SelectMonth";

const BalanceSheet = () => {
  const { user, transactions, selectedMonth } = useStore(); // グローバルストアからユーザーとトランザクションデータを取得
  const [income, setIncome] = useState(0); // 収入の状態を管理
  const [expense, setExpense] = useState(0); // 支出の状態を管理

  // トランザクションを基に収入と支出を計算する関数
  const calculateBalance = useCallback(() => {
    if (transactions) {
      // 選択された月のトランザクションのみをフィルタリング
      const filteredTransactions = transactions.filter(
        (transaction) =>
          transaction !== null &&
          transaction !== undefined &&
          transaction.date.startsWith(selectedMonth)
      );
      // 収入の合計を計算（変換された金額を使用）
      const incomeSum = filteredTransactions
        .filter((transaction) => transaction.type === "Income")
        .reduce(
          (sum, transaction) => sum + Number(transaction.converted_amount),
          0
        );
      // 支出の合計を計算（変換された金額を使用）
      const expenseSum = filteredTransactions
        .filter((transaction) => transaction.type === "Expense")
        .reduce(
          (sum, transaction) => sum + Number(transaction.converted_amount),
          0
        );

      setIncome(incomeSum);
      setExpense(expenseSum);
    }
  }, [transactions, selectedMonth]);

  // トランザクションデータが変更されたときに収入と支出を再計算
  useEffect(() => {
    calculateBalance();
  }, [transactions, calculateBalance]);

  const balance = income - expense; // バランスを計算

  return (
    <section className="p-10">
      <Title title="Balance Sheet" /> {/* タイトルを表示 */}
      <SelectMonth /> {/* Use the SelectMonth component */}
      <BalanceCard
        title="Income"
        amount={income}
        currencySymbol={getCurrencySymbol(user.primary_currency)}
        bgColor="bg-blue"
      />
      <BalanceCard
        title="Expense"
        amount={expense}
        currencySymbol={getCurrencySymbol(user.primary_currency)}
        bgColor=" bg-red"
      />
      <BalanceCard
        title="Balance"
        amount={balance}
        currencySymbol={getCurrencySymbol(user.primary_currency)}
        bgColor="bg-green"
      />
    </section>
  );
};

export default BalanceSheet;
