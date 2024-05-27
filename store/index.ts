// store/index.ts
import { create } from "zustand";
import type { Database } from "@/lib/database.types";
import { supabase } from "@/utils/supabase";

// プロフィール情報の型定義
type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

// トランザクション情報の型定義
type TransactionType = Database["public"]["Tables"]["transactions"]["Row"];

// Zustandで管理する状態の型定義
type StateType = {
  user: ProfileType; // 現在のユーザー情報
  transactions: TransactionType[]; // 現在のユーザーのトランザクション情報の配列
  setUser: (payload: ProfileType) => void; // ユーザー情報を更新する関数
  setTransactions: (payload: TransactionType[]) => void; // トランザクション情報を更新する関数
  addTransaction: (transaction: TransactionType) => void; // 新しいトランザクションを追加する関数
  fetchTransactions: (userId: string) => Promise<void>; // ユーザーIDを基にトランザクション情報を取得する非同期関数
};

// Zustandのストアを作成
const useStore = create<StateType>((set) => ({
  // 初期値設定
  user: { id: "", email: "", name: "", introduce: "", avatar_url: "" },
  transactions: [],

  // ユーザー情報を更新する関数の実装
  setUser: (payload) => set({ user: payload }),

  // トランザクション情報を更新する関数の実装
  setTransactions: (payload) => set({ transactions: payload }),

  // 新しいトランザクションを追加する関数の実装
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),

  // ユーザーIDを基にトランザクション情報を取得する非同期関数の実装
  fetchTransactions: async (userId: string) => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId); // ユーザーIDに一致するトランザクションを取得

    if (error) {
      console.error("Error fetching transactions:", error); // エラーが発生した場合のログ出力
    } else {
      set({ transactions: data }); // 成功した場合はトランザクション情報を更新
    }
  },
}));

export default useStore;
