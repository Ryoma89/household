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
import { transformToBarData } from "@/utils/transaformData";

// ChartJSの必要なコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const BarChart = () => {
  const { transactions, selectedMonth } = useStore();
  const [data, setData] = useState<PieChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (transactions) {
      const barData = transformToBarData(transactions, selectedMonth);
      setData(barData);
    }
  }, [transactions, selectedMonth]);

  if (!transactions) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10 bg-white rounded-lg mt-10">
      <Title title="Bar Chart" />
      {data.labels.length > 0 ? (
        <div className="mt-10 h-[400px]  w-full flex flex-col items-center">
          <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      ) : (
        <p className="mt-5 text-center">No transactions found for the selected month.</p>
      )}
    </div>
  );
};

export default BarChart;
