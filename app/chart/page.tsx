"use client";
import React from "react";
import Nav from "../components/layouts/Nav";
import { Separator } from "@/components/ui/separator";
import SelectMonth from "../components/elements/SelectMonth";
import PieChart from "@/features/chart/PieChart";
import DonutChart from "@/features/chart/DonutChart";
import BarChart from "@/features/chart/BarChart";


const ChartPage = () => {
  return (
    <>
      <Nav />
      <Separator />
      <section className="px-10 pt-5 pb-14 bg-gray-100">
        <SelectMonth /> {/* Use the SelectMonth component */}
        <div className="md:grid md:grid-cols-2 md:gap-7">
          <div className="mt-10 md:mt-0">
            <PieChart />
          </div>
          <div className="mt-10 md:mt-0">
            <DonutChart />
          </div>
        </div>
        <div className="w-full h-[550px]">
          <BarChart />
        </div>
      </section>
    </>
  );
};

export default ChartPage;
