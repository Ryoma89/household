'use client';
import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import Title from "@/app/components/elements/Title";
import useStore from "@/store";
import { PieChartData } from "@/types/cart";

// ChartJSの必要なコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const defaultColor = "rgba(169, 169, 169, 0.2)";

type Props = {
  selectedMonth: string;
}

const BarChart = ({ selectedMonth }: Props) => {
  const { transactions } = useStore();
  const [data, setData] = useState<PieChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!transactions) return;

    const filteredTransactions = transactions.filter(
      (transaction) =>
        transaction &&
        transaction.date.startsWith(selectedMonth)
    );

    const dailyData: { [key: string]: { Income: number; Expense: number } } = filteredTransactions.reduce((acc, transaction) => {
      const date = transaction.date.split('T')[0];
      if (!acc[date]) {
        acc[date] = { Income: 0, Expense: 0 };
      }
      if (transaction.type === "Income" || transaction.type === "Expense") {
        acc[date][transaction.type as "Income" | "Expense"] += Number(transaction.converted_amount); // converted_amountを使用
      }
      return acc;
    }, {} as { [key: string]: { Income: number; Expense: number } });

    const dates = Object.keys(dailyData).sort();
    const incomeData = dates.map(date => dailyData[date].Income);
    const expenseData = dates.map(date => dailyData[date].Expense);

    setData({
      labels: dates,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: Array(incomeData.length).fill("rgba(75, 192, 192, 1)"),
          borderColor: Array(incomeData.length).fill("rgba(75, 192, 192, 1)"),
          borderWidth: 1,
        },
        {
          label: 'Expense',
          data: expenseData,
          backgroundColor: Array(expenseData.length).fill("rgba(255, 99, 132, 1)"),
          borderColor: Array(expenseData.length).fill("rgba(255, 99, 132, 1)"),
          borderWidth: 1,
        },
      ],
    });
  }, [transactions, selectedMonth]);

  if (!transactions) {
    return <p>Loading...</p>;
  }

  return (
    <section className="p-10 bg-white rounded-lg mt-10">
      <Title title="Bar Chart" />
      {data.labels.length > 0 ? (
        <div className="mt-10 h-[400px] w-full flex flex-col items-center">
            <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      ) : (
        <p className="mt-5 text-center">No transactions found for the selected month.</p>
      )}
    </section>
  );
};

export default BarChart;
