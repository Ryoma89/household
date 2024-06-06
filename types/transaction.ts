export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  category: string;
  amount: number;
  converted_amount: number;
  type: string;
  content: string;
  currency: string;
  created_at: string;
}

// トランザクション情報の型定義
export type TransactionType = {
  id: string;
  user_id: string;
  date: string;
  category: string;
  amount: number;
  converted_amount: number;
  type: string;
  content: string;
  currency: string;
  created_at: string;
};

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

