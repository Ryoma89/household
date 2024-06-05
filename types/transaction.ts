export interface Transaction {
  date: string;
  amount: number;
  type: "Income" | "Expense";
  category: string;
  content: string;
  createdAt: string;
  user_id: string;
  id: string;
  currency: string;
}

export type IncomeCategory =
  | "salary"
  | "allowance"
  | "rent"
  | "stock"
  | "investment";
export type ExpenseCategory =
  | "food"
  | "daily"
  | "rent"
  | "enjoy"
  | "entertainment"
  | "transportation";

export interface Income {
  income: number;
}
export interface Expense {
  expense: number;
}
export interface Balance {
  balance: number;
}

// トランザクション情報の型定義
export type TransactionType = {
  id: string;
  user_id: string;
  date: string;
  category: string;
  amount: number;
  type: string;
  content: string;
  currency: string; // currencyプロパティを追加
};
