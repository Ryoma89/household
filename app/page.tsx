import HomeContent from "@/features/home/HomeContent";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers' 
import type { Database } from '@/lib/database.types'
import { redirect } from "next/navigation";
export default async function Home() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // ユーザーの取得
  const { data: { user }, error } = await supabase.auth.getUser()

  // 認証している場合、リダイレクト
  if (user) {
    redirect('/dashboard')
  }
  
  return (
    <main>
    <HomeContent />
    </main>
  );
}
