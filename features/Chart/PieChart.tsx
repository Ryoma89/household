'use client';
import React, { useEffect, useState, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import Title from "@/app/components/elements/Title";
import TypeButton from "@/app/components/elements/TypeButton";
import useStore from "@/store";
import { PieChartData } from "@/types/cart";
import { IncomeCategory, ExpenseCategory } from "@/types/transaction";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

const incomeColors: { [key in IncomeCategory]: string } = {
  salary: "rgba(255, 99, 132, 1)",
  allowance: "rgba(54, 162, 235, 1)",
  rent: "rgba(255, 206, 86, 1)",
  stock: "rgba(75, 192, 192, 1)",
  investment: "rgba(153, 102, 255, 1)",
};

const expenseColors: { [key in ExpenseCategory]: string } = {
  food: "rgba(255, 99, 132, 1)",
  daily: "rgba(54, 162, 235, 1)",
  rent: "rgba(255, 206, 86, 1)",
  enjoy: "rgba(75, 192, 192, 1)",
  entertainment: "rgba(153, 102, 255, 1)",
  transportation: "rgba(255, 159, 64, 1)",
};

const defaultColor = "rgba(169, 169, 169, 1)";

type Props = {
  selectedMonth: string;
}

const PieChart = ({ selectedMonth }: Props) => {
  const { user, transactions, fetchTransactions } = useStore();
  const [selectedType, setSelectedType] = useState<"Income" | "Expense">("Income");
  const [data, setData] = useState<PieChartData>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        console.error("User ID not available");
        return;
      }
      await fetchTransactions(user.id);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [fetchData, user?.id]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setData({
        labels: [],
        datasets: [],
      });
      return;
    }

    console.log("Transactions:", transactions);

    const filteredTransactions = transactions.filter(
      (transaction) =>
        transaction &&
        transaction.type === selectedType &&
        transaction.date.startsWith(selectedMonth)
    );

    console.log("Filtered Transactions:", filteredTransactions);

    if (filteredTransactions.length === 0) {
      console.error("No transactions found for the selected type and month");
      setData({
        labels: [],
        datasets: [],
      });
      return;
    }

    const categories = filteredTransactions.map((transaction) => transaction.category);
    const uniqueCategories = Array.from(new Set(categories));
    const dataAmounts = uniqueCategories.map(
      (category) =>
        filteredTransactions
          .filter((transaction) => transaction.category === category)
          .reduce((total, transaction) => total + Number(transaction.converted_amount), 0)
    );

    const backgroundColors = uniqueCategories.map((category) => {
      if (selectedType === "Income") {
        return incomeColors[category as IncomeCategory] || defaultColor;
      } else {
        return expenseColors[category as ExpenseCategory] || defaultColor;
      }
    });

    setData({
      labels: uniqueCategories,
      datasets: [
        {
          label: selectedType,
          data: dataAmounts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace("0.2", "1")),
          borderWidth: 1,
        },
      ],
    });

    console.log("Data fetched successfully:", {
      labels: uniqueCategories,
      datasets: [
        {
          label: selectedType,
          data: dataAmounts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace("0.2", "1")),
          borderWidth: 1,
        },
      ],
    });
  }, [selectedType, selectedMonth, transactions]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="p-10 bg-white rounded-lg h-[600px]">
      <Title title="PieChart" />
      <div className="flex flex-col items-center justify-center">
        <TypeButton setSelectedType={setSelectedType} />
      </div>
      {data.labels.length > 0 ? (
        <div className="mt-3 h-[400px] w-full">
          <Pie data={data} options={options} />
        </div>
      ) : (
        <p className="mt-5 text-center">No transactions found for the selected month.</p>
      )}
    </section>
  );
};

export default PieChart;
