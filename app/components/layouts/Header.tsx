"use client";
import Link from "next/link";
import useStore from "@/store";
import Image from "next/image";
import { useEffect } from "react";
import type { User } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

const Header = ({
  user,
  profile,
}: {
  user: User | null;
  profile: ProfileType | null;
}) => {
  const { setUser } = useStore();

  // 状態管理にユーザー情報を保存
  useEffect(() => {
    setUser({
      id: user ? user.id : "",
      email: user ? user.email! : "",
      name: user && profile ? profile.name : "",
      introduce: user && profile ? profile.introduce : "",
      avatar_url: user && profile ? profile.avatar_url : "",
    });
  }, [user, setUser, profile]);

  return (
    <header className="flex justify-between items-center px-5 py-3 h-auto">
      <h1 className="">
        <img src="/logo.png" alt="" className="h-14" />
      </h1>
      {user ? (
        <div className="flex items-center space-x-5 text-xl">
          <Link href="/settings/profile">
            <div className="relative w-10 h-10">
              <Image
                src={
                  profile && profile.avatar_url
                    ? profile.avatar_url
                    : "/default.png"
                }
                className="rounded-full object-cover"
                alt="avatar"
                fill
              />
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex items-center space-x-5">
          <Link href="/auth/login">
            <Button className="bg-accentColor  w-[115px] font-bold">Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-subColor  w-[115px] font-bold">Sign Up</Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
