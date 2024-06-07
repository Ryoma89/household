"use client";
import React, { useState, useEffect } from "react";
import Nav from "../components/layouts/Nav";
import BarChart from "@/features/chart/BarChart";
import PieChart from "@/features/chart/PieChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DonutChart from "@/features/chart/DonutChart";
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

  useEffect(() => {
    setSelectedMonth(getCurrentYearMonth());
  }, []);

  return (
    <>
      <Nav />
      <Separator />
      <section className="px-10 pt-5 pb-14 bg-gray-100">
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
          <div>
            <PieChart selectedMonth={selectedMonth} />
          </div>
          <div>
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
