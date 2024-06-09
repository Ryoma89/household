"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SheetClose } from "@/components/ui/sheet"; // Import SheetClose
import * as Accordion from '@radix-ui/react-accordion';
import { subNavigation } from "@/app/settings/layout";
import { ChevronDownIcon } from "lucide-react";

const ResponsiveNav = () => {
  const pathname = usePathname(); // 現在のパスを取得

  const getLinkClass = (path: string) => {
    return pathname === path ? "text-xl text-blue-500 hover:opacity-50" : "text-xl hover:opacity-50";
  };

  return (
    <nav className="pb-5">
      <ul className="flex flex-col">
        <li className="py-5">
          <SheetClose asChild>
            <Link href="/dashboard" className={getLinkClass("/dashboard")}>
              Dashboard
            </Link>
          </SheetClose>
        </li>
        <Separator />
        <li className="py-5">
          <SheetClose asChild>
            <Link href="/budget" className={getLinkClass("/budget")}>
              Budget
            </Link>
          </SheetClose>
        </li>
        <Separator />
        <li className="py-5">
          <SheetClose asChild>
            <Link href="/chart" className={getLinkClass("/chart")}>
              Chart
            </Link>
          </SheetClose>
        </li>
        <Separator />
        <li className="py-5">
          <SheetClose asChild>
            <Link href="/multi-currency" className={getLinkClass("/multi-currency")}>
              Multi Currency
            </Link>
          </SheetClose>
        </li>
        <Separator />
        <li className="py-5">
          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="profile">
              <Accordion.Header>
                <Accordion.Trigger className="w-full text-left flex items-center justify-between">
                    <div className={getLinkClass("/settings/profile")}>
                      Profile
                    </div>
                    <ChevronDownIcon className="w-5 h-5 ml-2" aria-hidden="true" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pl-5">
                <ul>
                  {subNavigation.map((item, index) => (
                    <li key={index} className="py-2">
                      <SheetClose asChild>
                        <Link href={item.href} className="flex items-center text-lg hover:opacity-50">
                          <item.icon className="w-5 h-5 mr-2" />
                          {item.name}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </li>
        <Separator />
      </ul>
    </nav>
  );
};

export default ResponsiveNav;
