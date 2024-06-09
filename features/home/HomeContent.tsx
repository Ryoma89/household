import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const HomeContent = () => {
  return (
    <div
      className="sm:grid sm:grid-cols-2 sm:items-center sm:mt-0 mt-10"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="text-center p-3">
        <h2 className="xs:text-7xl sm:text-4xl font-bold">MoneyMate</h2>
        <p className="text-xl sm:text-lg sm:mt-5 xs:mt-10 mt-5">
          Your Best Partner in Household Budgeting
        </p>
        <div className="flex justify-center">
            <Link href="/auth/login" className="mt-10">
              <Button className="bg-accentColor w-[140px] sm:w-[100px] font-bold mr-5">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup" className="mt-10">
              <Button className="bg-subColor w-[140px] sm:w-[100px] font-bold ml-5">
                Sign Up
              </Button>
            </Link>
        </div>
      </div>
      <div className="h-full sm:block hidden">
        <img src="/Home.png" alt="" className="h-full" />
      </div>
    </div>
  );
};

export default HomeContent;
