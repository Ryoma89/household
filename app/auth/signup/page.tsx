import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

import type { Database } from '@/lib/database.types'
import Signup from '@/features/home/SignUp'

// サインアップページ
const SignupPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // ユーザーの取得
  const { data: { user }, error } = await supabase.auth.getUser()

  // 認証している場合、リダイレクト
  if (user) {
    redirect('/dashboard')
  }

  return <Signup />
}

export default SignupPage
