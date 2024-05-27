'use client'
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import useStore from "@/store";
import Title from "@/app/components/elements/Title";
import BalanceCard from "@/app/components/elements/BalanceCard";

const BalanceSheet = () => {
  const { user } = useStore();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      if (user.id) {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id);

          if (error) {
            console.error("Error fetching transactions:", error);
          } else {
            const incomeSum = data
              .filter((transaction) => transaction.type === "Income")
              .reduce((sum, transaction) => sum + Number(transaction.amount), 0);  // 修正
            const expenseSum = data
              .filter((transaction) => transaction.type === "Expense")
              .reduce((sum, transaction) => sum + Number(transaction.amount), 0);  // 修正
            
            setIncome(incomeSum);
            setExpense(expenseSum);
          }
      }
    }

    fetchBalance();
  }, [user]);

  const balance = income - expense;

  return (
    <section className="p-10">
      <Title title="Balance Sheet" />
      <BalanceCard income={income} expense={expense} balance={balance} />
    </section>
  );
};

export default BalanceSheet;
