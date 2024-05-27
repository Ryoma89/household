// DashboardList.tsx
'use client'
import React, { useEffect, useState, useCallback } from "react";
import useStore from "@/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Title from "@/app/components/elements/Title";
import { Trash2 } from "lucide-react";
import { supabase } from "@/utils/supabase";

const DashboardList = () => {
  const { user, transactions, fetchTransactions } = useStore();
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());

  const fetchUserTransactions = useCallback(async () => {
    if (user && user.id) {
      await fetchTransactions(user.id);
    }
  }, [user, fetchTransactions]);

  useEffect(() => {
    fetchUserTransactions();
  }, [fetchUserTransactions]);

  if (!user) {
    return null; // userが存在しない場合、何もレンダリングしない
  }

  const handleCheckboxChange = (transactionId: string) => {
    setSelectedTransactions((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(transactionId)) {
        newSelected.delete(transactionId);
      } else {
        newSelected.add(transactionId);
      }
      return newSelected;
    });
  };

  const handleDelete = async () => {
    const transactionIds = Array.from(selectedTransactions);
    const { error } = await supabase
      .from("transactions")
      .delete()
      .in("id", transactionIds);

    if (error) {
      console.error("Error deleting transactions:", error);
    } else {
      fetchTransactions(user.id); // 削除後に最新のトランザクションを取得
      setSelectedTransactions(new Set());
    }
  };

  return (
    <section className="p-10">
      <Title title="Dashboard List" />
      <div className="mt-10">
        <div className="flex justify-end mb-4">
          <button
            className="flex items-center bg-red hover:opacity-70 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            onClick={handleDelete}
            disabled={selectedTransactions.size === 0}
          >
            <Trash2 className="mr-2" />
            Delete
          </button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedTransactions(
                        isChecked ? new Set(transactions.map((t) => t.id)) : new Set()
                      );
                    }}
                  />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Content</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => 
                  transaction ? ( // transaction が null でないことを確認
                    <TableRow key={transaction.id}>
                      <TableCell className="w-10">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.has(transaction.id)}
                          onChange={() => handleCheckboxChange(transaction.id)}
                        />
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>¥{transaction.amount}</TableCell>
                      <TableCell>{transaction.content}</TableCell>
                    </TableRow>
                  ) : null // null の場合は何もレンダリングしない
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>No transactions found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default DashboardList;
