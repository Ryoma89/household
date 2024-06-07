import React, { useCallback, useEffect, useState } from "react";
import BalanceCard from "@/app/components/elements/BalanceCard";
import useStore from "@/store";
import { getCurrencySymbol } from "@/constants/currencies";
import { supabase } from "@/utils/supabase";

const BudgetCard = () => {
  const { user, transactions, fetchTransactions, selectedMonth } = useStore();
  const [expense, setExpense] = useState(0);
  const [budgetBalance, setBudgetBalance] = useState(0);
  const [amount, setAmount] = useState(0);

  const saveBudget = async () => {
    try {
      const { error } = await supabase
        .from("budgets")
        .upsert([
          {
            user_id: user.id,
            month: selectedMonth,
            amount: amount,
            currency: user.primary_currency,
            updated_at: new Date(),
          },
        ]);

      if (error) {
        console.error("Error updating budget:", error);
        return;
      }

      setBudgetBalance(amount - expense);
    } catch (error) {
      console.error("Error in saveBudget:", error);
    }
  };

  const fetchBudgetAmount = async () => {
    if (!user.id) {
      console.error("Error: user.id is undefined");
      return;
    }

    try {
      const { data, error, status } = await supabase
        .from("budgets")
        .select("amount")
        .eq("user_id", user.id)
        .eq("month", selectedMonth)
        .single();

      if (error && status !== 406) {
        console.error("Error fetching budget amount:", error);
        return;
      }

      if (data) {
        setAmount(data.amount);
        setBudgetBalance(data.amount - expense);
      } else {
        console.log("No budget data found for the selected month.");
        setAmount(0);
        setBudgetBalance(0 - expense);
      }
    } catch (error) {
      console.error("Error in fetchBudgetAmount:", error);
      setAmount(0);
      setBudgetBalance(0 - expense);
    }
  };

  const calculateExpenses = useCallback(() => {
    try {
      if (transactions && transactions.length > 0) {
        const filteredTransactions = transactions.filter(
          (transaction) =>
            transaction !== null &&
            transaction !== undefined &&
            transaction.date.startsWith(selectedMonth)
        );

        const expenseSum = filteredTransactions
          .filter((transaction) => transaction.type === "Expense")
          .reduce((sum, transaction) => sum + Number(transaction.converted_amount), 0);

        setExpense(expenseSum);
        setBudgetBalance(amount - expenseSum);
      }
    } catch (error) {
      console.error("Error in calculateExpenses:", error);
    }
  }, [transactions, selectedMonth, amount]);

  useEffect(() => {
    if (user.id) {
      fetchTransactions(user.id).then(() => {
        fetchBudgetAmount().then(() => {
          calculateExpenses();
        });
      });
    }
  }, [selectedMonth, user.id, fetchTransactions]);

  useEffect(() => {
    calculateExpenses();
  }, [transactions, selectedMonth, calculateExpenses]);

  return (
    <div className="flex justify-center items-center">
      <div className="md:col-span-2 w-1/3">
        <BalanceCard
          title="Budget"
          amount={amount}
          currencySymbol={getCurrencySymbol(user.primary_currency)}
          bgColor="bg-blue"
        />
      </div>
      <div className="text-center text-4xl mx-3">-</div>
      <div className="md:col-span-2 w-1/3">
        <BalanceCard
          title="Expense"
          amount={expense}
          currencySymbol={getCurrencySymbol(user.primary_currency)}
          bgColor="bg-red"
        />
      </div>
      <div className="text-center text-4xl mx-3">=</div>
      <div className="md:col-span-2 w-1/3">
        <BalanceCard
          title="Balance"
          amount={budgetBalance}
          currencySymbol={getCurrencySymbol(user.primary_currency)}
          bgColor="bg-green"
        />
      </div>
    </div>
  );
};

export default BudgetCard;
