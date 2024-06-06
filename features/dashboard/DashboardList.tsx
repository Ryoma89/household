'use client'
import React, { useEffect, useState, useCallback } from "react";
import useStore from "@/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Title from "@/app/components/elements/Title";
import { Trash2 } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { format } from "date-fns";
import { getCurrencySymbol } from "@/constants/currencies";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";  // Import the useToast hook

const getCurrentYearMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const DashboardList = () => {
  const { user, transactions, fetchTransactions } = useStore();
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentYearMonth());
  const { toast } = useToast();  // Use the toast hook

  const fetchUserTransactions = useCallback(async () => {
    if (user && user.id) {
      await fetchTransactions(user.id);
    }
  }, [user, fetchTransactions]);

  useEffect(() => {
    fetchUserTransactions();
  }, [fetchUserTransactions]);

  if (!user) {
    return null;
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
    const { error } = await supabase.from("transactions").delete().in("id", transactionIds);

    if (error) {
      console.error("Error deleting transactions:", error);
    } else {
      fetchTransactions(user.id);
      setSelectedTransactions(new Set());
      toast({ title: "Success", description: "Selected transactions have been successfully deleted." });
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction !== null && transaction !== undefined && transaction.date.startsWith(selectedMonth)
  );

  const months = Array.from({ length: 12 }, (_, i) => {
    const year = new Date().getFullYear();
    const month = String(i + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  return (
    <section className="p-10">
      <Title title="Dashboard List" />
      <div className="flex justify-center items-center mb-5 mt-10">
        <Select onValueChange={(value) => setSelectedMonth(value)} value={selectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{selectedMonth}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-5">
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
                        isChecked ? new Set(filteredTransactions.map((t) => t.id)) : new Set()
                      );
                    }}
                  />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Content</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => 
                  transaction ? (
                    <TableRow key={transaction.id}>
                      <TableCell className="w-10">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.has(transaction.id)}
                          onChange={() => handleCheckboxChange(transaction.id)}
                        />
                      </TableCell>
                      <TableCell>{format(new Date(transaction.date), "yyyy-MM-dd")}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>{transaction.currency}</TableCell>
                      <TableCell>{getCurrencySymbol(transaction.currency)}{transaction.amount}</TableCell>
                      <TableCell>{transaction.content || 'No content'}</TableCell>
                    </TableRow>
                  ) : null
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>No transactions found.</TableCell>
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
