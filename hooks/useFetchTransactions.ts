import { useEffect } from 'react';
import useStore from '@/store';

export const useFetchTransactions = (userId: string) => {
  const fetchTransactions = useStore((state) => state.fetchTransactions);
  
  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [userId, fetchTransactions]);
};
