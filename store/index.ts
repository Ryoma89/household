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
  setUser: (payload: ProfileType) => void;
  setTransactions: (payload: TransactionType[]) => void;
  addTransaction: (transaction: TransactionType) => void;
  fetchTransactions: (userId: string) => Promise<void>;
};

// Zustandのストアを作成
const useStore = create<StateType>((set) => ({
  user: { id: "", email: "", name: "", introduce: "", avatar_url: "" },
  transactions: [],
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
}));

export default useStore;
