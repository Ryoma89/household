'use client';
import React, { useEffect, useState } from "react";
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
import { useFetchTransactions } from "@/hooks/useFetchTransactions";
import { transformToPieData } from "@/utils/transaformData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

const PieChart = () => {
  const { user, transactions, selectedMonth } = useStore();
  const [selectedType, setSelectedType] = useState<"Income" | "Expense">("Income");
  const [data, setData] = useState<PieChartData>({
    labels: [],
    datasets: [],
  });

  const loading = useFetchTransactions(user?.id);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setData({
        labels: [],
        datasets: [],
      });
      return;
    }

    const filteredTransactions = transactions.filter(
      (transaction) =>
        transaction &&
        transaction.type === selectedType &&
        transaction.date.startsWith(selectedMonth)
    );

    if (filteredTransactions.length === 0) {
      setData({
        labels: [],
        datasets: [],
      });
      return;
    }

    const pieData = transformToPieData(filteredTransactions);

    const datasetIndex = selectedType === "Income" ? 0 : 1;

    setData({
      labels: pieData.labels,
      datasets: [pieData.datasets[datasetIndex]],
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
    <div className="p-10 bg-white rounded-lg h-[600px]">
      <Title title="PieChart" />
      <div className="flex flex-col items-center justify-center">
        <TypeButton setSelectedType={setSelectedType} />
      </div>
      {data.labels.length > 0 ? (
        <div className="mt-3 h-[400px] w-full">
          <Pie data={data} options={options} />
        </div>
      ) : (
        <p className="mt-5 text-center">No transactions found for the selected type and month.</p>
      )}
    </div>
  );
};

export default PieChart;
