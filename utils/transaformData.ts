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

export const transformToBarData = (transactions: TransactionType[], selectedMonth: string): PieChartData => {
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
      acc[date][transaction.type as "Income" | "Expense"] += Number(transaction.converted_amount);
    }
    return acc;
  }, {} as { [key: string]: { Income: number; Expense: number } });

  const dates = Object.keys(dailyData).sort();
  const incomeData = dates.map(date => dailyData[date].Income);
  const expenseData = dates.map(date => dailyData[date].Expense);

  return {
    labels: dates,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: dates.map(() => "rgba(75, 192, 192, 1)"),  // 変更
        borderColor: dates.map(() => "rgba(75, 192, 192, 1)"),  // 変更
        borderWidth: 1,
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: dates.map(() => "rgba(255, 99, 132, 1)"),  // 変更
        borderColor: dates.map(() => "rgba(255, 99, 132, 1)"),  // 変更
        borderWidth: 1,
      },
    ],
  };
};

export const transformToDoughnutData = (transactions: TransactionType[], selectedMonth: string) => {
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.date.startsWith(selectedMonth)
  );

  const income = filteredTransactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((acc, transaction) => acc + Number(transaction.converted_amount), 0);

  const expense = filteredTransactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((acc, transaction) => acc + Number(transaction.converted_amount), 0);

  return {
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
  };
};
