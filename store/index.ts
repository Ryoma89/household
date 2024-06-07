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
};

// 現在の年と月を取得する関数
const getCurrentYearMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

// Zustandのストアを作成
const useStore = create<StateType>((set) => ({
  user: { id: "", email: "", name: "", introduce: "", avatar_url: "", primary_currency: "USD" },
  transactions: [],
  selectedMonth: getCurrentYearMonth(), // 初期値として現在の年と月を設定
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
}));

export default useStore;
