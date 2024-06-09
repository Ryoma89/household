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

  return (
    <div className='pt-10 relative' style={{ height: 'calc(100vh - 88px)', background:  "#f4f4f4"}}>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5'>
      <Signup />
      </div>
    </div>
  )
}

export default SignupPage
