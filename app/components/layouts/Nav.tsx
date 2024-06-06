"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation"; // usePathnameをインポート

const Nav = () => {
  const pathname = usePathname(); // 現在のパスを取得

  const getLinkClass = (path: string) => {
    return pathname === path ? "text-xl text-blue-500 hover:opacity-50" : "text-xl hover:opacity-50";
  };

  return (
    <nav className="pb-5">
      <ul className="flex justify-center items-center">
        <li className="mr-10">
          <Link href="/dashboard" className={getLinkClass("/dashboard")}>
            Dashboard
          </Link>
        </li>
        <li className="mr-10">
          <Link href="/chart" className={getLinkClass("/chart")}>
            Chart
          </Link>
        </li>
        <li className="mr-10">
          <Link href="/multi-currency" className={getLinkClass("/multi-currency")}>
            Multi Currency
          </Link>
        </li>
        <li>
          <Link href="/settings/profile" className={getLinkClass("/settings/profile")}>
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
