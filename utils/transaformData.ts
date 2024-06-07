import { ExpenseCategory, ExpenseData, IncomeCategory, IncomeData, TransactionType } from '@/types/transaction';
import { PieChartData } from '@/types/cart';

export const transformToPieData = (transactions: TransactionType[]): PieChartData => {
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

  const incomeData: IncomeData = transactions
    .filter((t) => t.type === 'Income')
    .reduce((acc: IncomeData, t) => {
      const category = t.category as IncomeCategory;
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {});

  const expenseData: ExpenseData = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc: ExpenseData, t) => {
      const category = t.category as ExpenseCategory;
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {});

  return {
    labels: [...Object.keys(incomeData), ...Object.keys(expenseData)],
    datasets: [
      {
        label: 'Income',
        data: Object.values(incomeData),
        backgroundColor: Object.keys(incomeData).map((category) => incomeColors[category as IncomeCategory] || "rgba(169, 169, 169, 1)"),
        borderColor: Object.keys(incomeData).map((category) => incomeColors[category as IncomeCategory] || "rgba(169, 169, 169, 1)"),
        borderWidth: 1,
      },
      {
        label: 'Expense',
        data: Object.values(expenseData),
        backgroundColor: Object.keys(expenseData).map((category) => expenseColors[category as ExpenseCategory] || "rgba(169, 169, 169, 1)"),
        borderColor: Object.keys(expenseData).map((category) => expenseColors[category as ExpenseCategory] || "rgba(169, 169, 169, 1)"),
        borderWidth: 1,
      },
    ],
  };
};
