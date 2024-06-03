"use client";
import React, { useState } from "react";
import Nav from "../components/layouts/Nav";
import BarChart from "@/features/Chart/BarChart";
import MultiBalance from "@/features/multiCurrency/MultiBalance";
import PieChart from "@/features/Chart/PieChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DonutChart from "@/features/Chart/DonutChart";
import { Separator } from "@/components/ui/separator";

const getCurrentYearMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

const ChartPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentYearMonth());
  const months = Array.from({ length: 12 }, (_, i) => {
    const year = new Date().getFullYear();
    const month = String(i + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  return (
    <>
      <Nav />
      <Separator />
      <section className="px-7 pt-4 pb-10 bg-gray-100">
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
        <div className="grid grid-cols-2 gap-7">
          <div className="">
            <PieChart selectedMonth={selectedMonth} />
          </div>
          <div className="">
            <DonutChart selectedMonth={selectedMonth} />
          </div>
        </div>
        <div className="w-full h-[550px]">
          <BarChart selectedMonth={selectedMonth} />
        </div>
      </section>
    </>
  );
};

export default ChartPage;
