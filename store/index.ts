import { create } from "zustand";
import type { Database } from "@/lib/database.types";
import { supabase } from "@/utils/supabase";
import { TransactionType } from "@/types/transaction";

// プロフィール情報の型定義
type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

// Zustandで管理する状態の型定義
type StateType = {
  user: ProfileType;
  transactions: TransactionType[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  setUser: (payload: ProfileType) => void;
  setTransactions: (payload: TransactionType[]) => void;
  addTransaction: (transaction: TransactionType) => void;
  fetchTransactions: (userId: string) => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<void>;
  fetchBudgetAmount: () => Promise<void>;
  budgetAmount: number;
  budgetBalance: number;
  expense: number;
  setExpense: (expense: number) => void;
  setBudgetBalance: () => void; // 追加
};

// 現在の年と月を取得する関数
const getCurrentYearMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

// Zustandのストアを作成
const useStore = create<StateType>((set, get) => ({
  user: { id: "", email: "", name: "", introduce: "", avatar_url: "", primary_currency: "USD" },
  transactions: [],
  selectedMonth: getCurrentYearMonth(),
  budgetAmount: 0,
  budgetBalance: 0,
  expense: 0,
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setUser: (payload) => set({ user: payload }),
  setTransactions: (payload) => set({ transactions: payload }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  fetchTransactions: async (userId: string) => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      set({ transactions: data as TransactionType[] });
    }
  },
  fetchUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching user profile:', error);
    } else {
      set({ user: data });
    }
  },
  fetchBudgetAmount: async () => {
    const user = get().user;
    const selectedMonth = get().selectedMonth;

    if (!user.id) {
      console.error("Error: user.id is undefined");
      return;
    }

    try {
      const { data, error, status } = await supabase
        .from("budgets")
        .select("amount")
        .eq("user_id", user.id)
        .eq("month", selectedMonth)
        .single();

      if (error && status !== 406) {
        console.error("Error fetching budget amount:", error);
        return;
      }

      if (data) {
        set({ budgetAmount: data.amount });
      } else {
        console.log("No budget data found for the selected month.");
        set({ budgetAmount: 0 });
      }
      get().setBudgetBalance(); // 追加
    } catch (error) {
      console.error("Error in fetchBudgetAmount:", error);
      set({ budgetAmount: 0 });
      get().setBudgetBalance(); // 追加
    }
  },
  setExpense: (expense) => set({ expense }),
  setBudgetBalance: () => {
    const { budgetAmount, expense } = get();
    set({ budgetBalance: budgetAmount - expense });
  } // 追加
}));

export default useStore;
