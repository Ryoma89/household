"use client"
import Title from '@/app/components/elements/Title'
import React from 'react'
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

// 必要なコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

const PieChart = () => {
  const data = {
    labels: ['Food', 'Rent', 'Entertainment', 'Utilities', 'Other'],
    datasets: [
      {
        label: 'Expenses',
        data: [300, 500, 100, 200, 50],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <section className='p-10'>
      <Title title='PieChart' />
      <Pie data={data} className='mt-10'/>
    </section>
  )
}

export default PieChart
