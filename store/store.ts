import create from "zustand";

interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: string;
  content: string;
  user_id: string;
}

interface State {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

const useTransactionStore = create<State>((set) => ({
  transactions: [],
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),
  setTransactions: (transactions) => set(() => ({ transactions })),
}));

export default useTransactionStore;
