"use client";
import Link from "next/link";
import React from "react";

const Nav = () => {
  return (
    <nav className="pb-5 ">
      <ul className="flex justify-center items-center">
        <Link href="/dashboard">
          <li className="mr-10 text-xl hover:opacity-50">Dashboard</li>
        </Link>
        <Link href="/chart">
          <li className="mr-10 text-xl hover:opacity-50">Chart</li>
        </Link>
        <Link href="/multi-currency">
          <li className="mr-10 text-xl hover:opacity-50">Multi Currency</li>
        </Link>
        <Link href="/settings/profile">
          <li className="text-xl hover:opacity-50">Profile</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
