import { create } from 'zustand'
import type { Database } from '@/lib/database.types'
import { supabase } from "@/utils/supabase";

type ProfileType = Database['public']['Tables']['profiles']['Row']
type TransactionType = Database['public']['Tables']['transactions']['Row']

type StateType = {
  user: ProfileType,
  transactions: TransactionType[],
  setUser: (payload: ProfileType) => void,
  setTransactions: (payload: TransactionType[]) => void,
  addTransaction: (transaction: TransactionType) => void,
  fetchTransactions: () => Promise<void>,
}

const useStore = create<StateType>((set) => ({
  user: { id: '', email: '', name: '', introduce: '', avatar_url: '' },
  transactions: [],
  setUser: (payload) => set({ user: payload }),
  setTransactions: (payload) => set({ transactions: payload }),
  addTransaction: (transaction) => set((state) => ({ transactions: [...state.transactions, transaction] })),
  fetchTransactions: async () => {
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      set({ transactions: data });
    }
  }
}))

export default useStore;
