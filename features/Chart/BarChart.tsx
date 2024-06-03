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

// デフォルトの色設定
const defaultColor = "rgba(169, 169, 169, 0.2)";

type Props = {
  selectedMonth: string;
}

const BarChart = ({ selectedMonth }: Props) => {
  const { transactions } = useStore(); // グローバルストアからトランザクションデータを取得
  const [data, setData] = useState<PieChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!transactions) return; // transactionsが初期化されるのを待つ

    // 選択された月に一致するトランザクションをフィルタリング
    const filteredTransactions = transactions.filter(
      (transaction) =>
        transaction &&
        transaction.date.startsWith(selectedMonth)
    );

    // 日付ごとの収入と支出を集計
    const dailyData: { [key: string]: { Income: number; Expense: number } } = filteredTransactions.reduce((acc, transaction) => {
      const date = transaction.date.split('T')[0]; // 日付のみを取得
      if (!acc[date]) {
        acc[date] = { Income: 0, Expense: 0 }; // 初期値を設定
      }
      if (transaction.type === "Income" || transaction.type === "Expense") {
        acc[date][transaction.type as "Income" | "Expense"] += transaction.amount; // 金額を集計
      }
      return acc;
    }, {} as { [key: string]: { Income: number; Expense: number } });

    const dates = Object.keys(dailyData).sort(); // 日付をソート
    const incomeData = dates.map(date => dailyData[date].Income); // 収入データを取得
    const expenseData = dates.map(date => dailyData[date].Expense); // 支出データを取得

    // グラフデータを設定
    setData({
      labels: dates,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: Array(incomeData.length).fill("rgba(75, 192, 192, 1)"), // 収入のバーの色
          borderColor: Array(incomeData.length).fill("rgba(75, 192, 192, 1)"),
          borderWidth: 1,
        },
        {
          label: 'Expense',
          data: expenseData,
          backgroundColor: Array(expenseData.length).fill("rgba(255, 99, 132, 1)"), // 支出のバーの色
          borderColor: Array(expenseData.length).fill("rgba(255, 99, 132, 1)"),
          borderWidth: 1,
        },
      ],
    });
  }, [transactions, selectedMonth]); // transactionsとselectedMonthが変更されたときに再実行

  if (!transactions) {
    return <p>Loading...</p>; // ローディング状態を表示
  }

  return (
    <section className="p-10">
      <Title title="Bar Chart" />
      {data.labels.length > 0 ? (
        <div className="mt-10" style={{ height: '400px', width: '100%' }}>
          <Bar data={data} /> {/* Bar Chartを表示 */}
        </div>
      ) : (
        <p className="mt-5 text-center">No transactions found for the selected month.</p> // トランザクションが見つからない場合
      )}
    </section>
  );
};

export default BarChart;
