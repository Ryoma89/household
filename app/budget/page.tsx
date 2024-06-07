"use client";
import React, { useEffect } from "react";
import Nav from "../components/layouts/Nav";
import { Separator } from "@/components/ui/separator";
import Title from "../components/elements/Title";
import BudgetInput from "@/features/budget/BudgetInput";
import SelectMonth from "../components/elements/SelectMonth";
import useStore from "@/store";
import BudgetCard from "@/features/budget/BudgetCard";

const getCurrentYearMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const BudgetPage = () => {
  const { setSelectedMonth } = useStore();

  useEffect(() => {
    setSelectedMonth(getCurrentYearMonth());
  }, [setSelectedMonth]);

  return (
    <>
      <Nav />
      <Separator />
      <section className="px-10 pt-10">
        <Title title="Budget" />
        <BudgetInput />
        <SelectMonth />
        <BudgetCard />
      </section>
    </>
  );
};

export default BudgetPage;
