export interface Transaction {
  date: string;
  amount: number;
  type: "Income" | "Expense";
  category: string;
  content: string;
  createdAt: string;
  user_id: string;
  id: string;
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
