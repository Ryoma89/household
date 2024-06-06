"use client";
import React, { useState, useEffect } from "react";
import Nav from "../components/layouts/Nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Title from "../components/elements/Title";
import BudgetCard from "@/features/budget/BudgetCard";
import BudgetInput from "@/features/budget/BudgetInput";

const getCurrentYearMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

const BudgetPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentYearMonth());
  const months = Array.from({ length: 12 }, (_, i) => {
    const year = new Date().getFullYear();
    const month = String(i + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  useEffect(() => {
    setSelectedMonth(getCurrentYearMonth());
  }, []);

  return (
    <>
      <Nav />
      <Separator />
      <section className="px-10 pt-10">
        <Title title="Budget" />

        {/* Budget Input */}
        <BudgetInput selectedMonth={selectedMonth} />

        {/* select */}
        <div className="flex justify-center items-center mb-5 mt-5">
          <Select
            onValueChange={(value) => setSelectedMonth(value)}
            value={selectedMonth}
          >
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

        {/* Budget Card */}
        <BudgetCard selectedMonth={selectedMonth} />
      </section>
    </>
  );
};

export default BudgetPage;
