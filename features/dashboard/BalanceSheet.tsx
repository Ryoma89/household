'use client'
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import useStore from "@/store";
import Title from "@/app/components/elements/Title";
import BalanceCard from "@/app/components/elements/BalanceCard";

const BalanceSheet = () => {
  const { user, transactions } = useStore();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const calculateBalance = useCallback(() => {
    if (transactions) {
      const validTransactions = transactions.filter(transaction => transaction !== null && transaction !== undefined);
      const incomeSum = validTransactions
        .filter((transaction) => transaction.type === "Income")
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      const expenseSum = validTransactions
        .filter((transaction) => transaction.type === "Expense")
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      
      setIncome(incomeSum);
      setExpense(expenseSum);
    }
  }, [transactions]);

  useEffect(() => {
    calculateBalance();
  }, [transactions, calculateBalance]);

  const balance = income - expense;

  return (
    <section className="p-10">
      <Title title="Balance Sheet" />
      <BalanceCard income={income} expense={expense} balance={balance} />
    </section>
  );
};

export default BalanceSheet;
