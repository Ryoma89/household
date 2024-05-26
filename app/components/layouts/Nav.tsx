import Link from "next/link";
import React from "react";

const Nav = () => {
  return (
    <nav className="p-5 border-b border-black">
      <ul className="flex justify-center items-center">
        <Link href="/dashboard">
          <li className="mr-4 text-xl hover:opacity-50">Dashboard</li>
        </Link>
        <Link href="/chart">
          <li className="mr-4 text-xl hover:opacity-50">Chart</li>
        </Link>
        <Link href="/settings/profile">
          <li className="text-xl hover:opacity-50">Profile</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
