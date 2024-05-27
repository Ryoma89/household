'use client'
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
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
import { Transaction } from "@/types/transaction";
import { Trash2 } from "lucide-react";

const DashboardList = () => {
  const { user } = useStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchTransactions() {
      if (user.id) {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching transactions:", error);
        } else {
          setTransactions(data);
        }
      }
    }

    fetchTransactions();
  }, [user]);

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
      setTransactions(transactions.filter((transaction) => !selectedTransactions.has(transaction.id)));
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
              {transactions.map((transaction) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default DashboardList;
