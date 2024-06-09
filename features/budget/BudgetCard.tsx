import React, { useCallback, useEffect } from "react";
import BalanceCard from "@/app/components/elements/BalanceCard";
import useStore from "@/store";
import { getCurrencySymbol } from "@/constants/currencies";

const BudgetCard = () => {
  const {
    user,
    transactions,
    fetchTransactions,
    selectedMonth,
    budgetAmount,
    budgetBalance,
    fetchBudgetAmount,
    expense,
    setExpense,
    setBudgetBalance // 追加
  } = useStore();

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
      } else {
        setExpense(0);
      }
    } catch (error) {
      console.error("Error in calculateExpenses:", error);
    }
  }, [transactions, selectedMonth, setExpense]);

  useEffect(() => {
    if (user.id) {
      fetchTransactions(user.id);
    }
  }, [selectedMonth, user.id, fetchTransactions]);

  useEffect(() => {
    fetchBudgetAmount();
  }, [selectedMonth, fetchBudgetAmount]);

  useEffect(() => {
    calculateExpenses();
  }, [transactions, selectedMonth, calculateExpenses]);

  // 追加: setBudgetBalanceを呼び出すuseEffect
  useEffect(() => {
    setBudgetBalance();
  }, [budgetAmount, expense, setBudgetBalance]);

  return (
    <>
      <div className="sm:flex sm:justify-center sm:items-center mt-10 sm:mt-0">
        <div className="md:col-span-2 sm:w-1/3">
          <BalanceCard
            title="Budget"
            amount={budgetAmount}
            currencySymbol={getCurrencySymbol(user.primary_currency)}
            bgColor="bg-blue"
          />
        </div>
        <div className="hidden sm:block text-center text-4xl mx-3">-</div>
        <div className="md:col-span-2 sm:w-1/3">
          <BalanceCard
            title="Expense"
            amount={expense}
            currencySymbol={getCurrencySymbol(user.primary_currency)}
            bgColor="bg-red"
          />
        </div>
        <div className="hidden sm:block text-center text-4xl mx-3">=</div>
        <div className="md:col-span-2 sm:w-1/3">
          <BalanceCard
            title="Balance"
            amount={budgetBalance}
            currencySymbol={getCurrencySymbol(user.primary_currency)}
            bgColor="bg-green"
          />
        </div>
      </div>
    </>
  );
};

export default BudgetCard;
