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
import { transformToDoughnutData } from "@/utils/transaformData";

// ChartJSの必要なコンポーネントを登録
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartTitle
);

const DonutChart = () => {
  const { transactions, selectedMonth } = useStore(); // グローバルストアからトランザクションデータを取得
  const [data, setData] = useState<PieChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (transactions) {
      const doughnutData = transformToDoughnutData(transactions, selectedMonth);
      setData(doughnutData);
    }
  }, [transactions, selectedMonth]);

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
        <p className="mt-5 text-center">No transactions found for the selected type and month.</p> // トランザクションが見つからない場合
      )}
    </section>
  );
};

export default DonutChart;
