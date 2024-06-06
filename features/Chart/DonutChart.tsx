'use client';
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title as ChartTitle,
} from "chart.js";
import Title from "@/app/components/elements/Title";
import useStore from "@/store";
import { PieChartData } from "@/types/cart";

// ChartJSの必要なコンポーネントを登録
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartTitle
);

type Props = {
  selectedMonth: string;
}

const DonutChart = ({ selectedMonth }: Props) => {
  const { transactions } = useStore(); // グローバルストアからトランザクションデータを取得
  const [data, setData] = useState<PieChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!transactions) return; // transactionsが初期化されるのを待つ

      try {
        // 選択された月に一致するトランザクションをフィルタリング
        const filteredTransactions = transactions.filter(
          (transaction) => transaction.date.startsWith(selectedMonth)
        );

        // 収入と支出を集計
        const income = filteredTransactions
          .filter((transaction) => transaction.type === "Income")
          .reduce((acc, transaction) => acc + Number(transaction.converted_amount), 0);

        const expense = filteredTransactions
          .filter((transaction) => transaction.type === "Expense")
          .reduce((acc, transaction) => acc + Number(transaction.converted_amount), 0);

        // グラフデータを設定
        setData({
          labels: ['Income', 'Expense'],
          datasets: [
            {
              label: 'Income vs Expense',
              data: [income, expense],
              backgroundColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching transactions:", error); // エラーが発生した場合にコンソールに出力
      }
    };

    fetchData();
  }, [transactions, selectedMonth]); // transactionsとselectedMonthが変更されたときに再実行

  // グラフのオプション設定
  const options = {
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Income vs Expense',
      },
    },
    responsive: true,
  };

  return (
    <section className="p-10 bg-white rounded-lg h-[600px]">
      <Title title="Donut Chart" />
      {data.labels.length > 0 ? (
        <div className="mt-16 h-[400px] w-full flex flex-col items-center">
          <Doughnut data={data} options={options} /> {/* Donut Chartを表示 */}
        </div>
      ) : (
        <p className="mt-5">No transactions found for the selected month.</p> // トランザクションが見つからない場合
      )}
    </section>
  );
};

export default DonutChart;
