'use client'
import React, { useEffect } from "react";
import Link from "next/link";
import useStore from "@/store";
import Image from "next/image";
import type { User } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ResponsiveNav from "./ResponsiveNav";


type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

const Header = ({ user, profile }: { user: User | null; profile: ProfileType | null }) => {
  const { setUser } = useStore();

  // 状態管理にユーザー情報を保存
  useEffect(() => {
    setUser({
      id: user ? user.id : "",
      email: user ? user.email! : "",
      name: user && profile ? profile.name : "",
      introduce: user && profile ? profile.introduce : "",
      avatar_url: user && profile ? profile.avatar_url : "",
      primary_currency: user && profile ? profile.primary_currency : "",
    });
  }, [user, setUser, profile]);

  return (
    <header className="flex justify-between items-center max-w-screen-xl mx-auto px-10 sm:py-3 py-4 h-auto">
      <h1 className="">
        <img src="/logo.png" alt="logo" className="h-14" />
      </h1>

      <div className="block sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
              <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-2xl">Menu</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              {user ? (
                <ResponsiveNav />
              ) : (
                <div className="">
                  <div className="text-xl py-5">
                    <SheetClose asChild>
                      <Link href="/auth/login">Login</Link>
                    </SheetClose>
                  </div>
                  <Separator />
                  <div className="text-xl py-5">
                    <SheetClose asChild>
                      <Link href="/auth/signup">Sign Up</Link>
                    </SheetClose>
                  </div>
                </div>
              )}
              {/* Include Nav component inside the Sheet */}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden sm:flex items-center space-x-5 text-xl">
        {user ? (
          <Link href="/settings/profile">
            <div className="relative w-10 h-10">
              <Image
                src={profile?.avatar_url || "/default.png"}
                className="rounded-full object-cover"
                alt="avatar"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
        ) : (
          <>
            <Link href="/auth/login">
              <Button className="bg-accentColor sm:w-[115px] font-bold">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-subColor sm:w-[115px] font-bold">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
