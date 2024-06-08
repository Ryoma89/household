import { useEffect, useState } from 'react';
import useStore from '@/store';

export const useFetchTransactions = (userId: string | undefined) => {
  const fetchTransactions = useStore((state) => state.fetchTransactions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        setLoading(true);
        await fetchTransactions(userId);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, fetchTransactions]);

  return loading;
};
