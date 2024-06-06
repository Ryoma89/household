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
import { IncomeCategory, ExpenseCategory } from "@/types/transaction";

// ChartJSの必要なコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

// 収入カテゴリごとの色を定義
const incomeColors: { [key in IncomeCategory]: string } = {
  salary: "rgba(255, 99, 132, 1)",
  allowance: "rgba(54, 162, 235, 1)",
  rent: "rgba(255, 206, 86, 1)",
  stock: "rgba(75, 192, 192, 1)",
  investment: "rgba(153, 102, 255, 1)",
};

// 支出カテゴリごとの色を定義
const expenseColors: { [key in ExpenseCategory]: string } = {
  food: "rgba(255, 99, 132, 1)",
  daily: "rgba(54, 162, 235, 1)",
  rent: "rgba(255, 206, 86, 1)",
  enjoy: "rgba(75, 192, 192, 1)",
  entertainment: "rgba(153, 102, 255, 1)",
  transportation: "rgba(255, 159, 64, 1)",
};

// デフォルトの色を定義
const defaultColor = "rgba(169, 169, 169, 1)";

// コンポーネントのプロパティの型を定義
type Props = {
  selectedMonth: string; // 選択された月
}

const PieChart = ({ selectedMonth }: Props) => {
  const { transactions } = useStore(); // グローバルストアからトランザクションデータを取得
  const [selectedType, setSelectedType] = useState<"Income" | "Expense">("Income"); // 初期選択タイプを収入に設定
  const [data, setData] = useState<PieChartData>({
    labels: [],
    datasets: [],
  });

  // トランザクションデータが変更されたときに実行する副作用フック
  useEffect(() => {
    if (!transactions) return; // transactionsが初期化されるのを待つ

    // 選択された月とタイプに一致するトランザクションをフィルタリング
    const filteredTransactions = transactions.filter(
      (transaction) =>
        transaction &&
        transaction.type === selectedType &&
        transaction.date.startsWith(selectedMonth)
    );

    // 各カテゴリのデータを集計
    const categories = filteredTransactions.map((transaction) => transaction.category);
    const uniqueCategories = Array.from(new Set(categories)); // ユニークなカテゴリを取得
    const dataAmounts = uniqueCategories.map(
      (category) =>
        filteredTransactions
          .filter((transaction) => transaction.category === category)
          .reduce((total, transaction) => total + Number(transaction.converted_amount), 0) // 各カテゴリの合計金額を計算
    );

    // 各カテゴリの色を設定
    const backgroundColors = uniqueCategories.map((category) => {
      if (selectedType === "Income") {
        return incomeColors[category as IncomeCategory] || defaultColor;
      } else {
        return expenseColors[category as ExpenseCategory] || defaultColor;
      }
    });

    // グラフデータを設定
    setData({
      labels: uniqueCategories, // カテゴリ名
      datasets: [
        {
          label: selectedType, // データセットのラベル
          data: dataAmounts, // 各カテゴリの金額データ
          backgroundColor: backgroundColors, // 各カテゴリの背景色
          borderColor: backgroundColors.map(color => color.replace("0.2", "1")), // 各カテゴリの枠線色
          borderWidth: 1, // 枠線の幅
        },
      ],
    });
  }, [transactions, selectedType, selectedMonth]); // 副作用フックが再実行される依存変数

  // グラフのオプション設定
  const options = {
    maintainAspectRatio: false, // アスペクト比を維持しない
    responsive: true, // レスポンシブ対応
  };

  // トランザクションデータがロードされていない場合の表示
  if (!transactions) {
    return <p>Loading...</p>; // ローディング状態を表示
  }

  return (
    <section className="p-10 bg-white rounded-lg h-[600px]">
      <Title title="PieChart" /> {/* グラフのタイトルを表示 */}
      <div className="flex flex-col items-center justify-center">
        <TypeButton setSelectedType={setSelectedType} /> {/* 収入と支出を切り替えるボタン */}
      </div>
      {data.labels.length > 0 ? ( // データがある場合
        <div className="mt-3 h-[400px] w-full">
          <Pie data={data} options={options} /> {/* Pieチャートを表示 */}
        </div>
      ) : (
        <p className="mt-5 text-center">No transactions found for the selected month.</p> // トランザクションが見つからない場合のメッセージ
      )}
    </section>
  );
};

export default PieChart;
