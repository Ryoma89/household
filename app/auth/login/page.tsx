import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

import type { Database } from '@/lib/database.types'
import Login from '@/features/home/Login'

// ログインページ
const LoginPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // ユーザーの取得
  const { data: { user }, error } = await supabase.auth.getUser()

  // 認証している場合、リダイレクト
  if (user) {
    redirect('/dashboard')
  }

  return <Login />
}

export default LoginPage
