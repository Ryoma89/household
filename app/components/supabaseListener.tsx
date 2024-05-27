'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/database.types'
import Header from './layouts/Header'

// 認証状態の監視
const SupabaseListener = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  // ユーザーの取得
  const { data: { user }, error } = await supabase.auth.getUser()

  // プロフィールの取得
  let profile = null
  if (user) {
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    profile = currentProfile

    // メールアドレスを変更した場合、プロフィールを更新
    if (currentProfile && currentProfile.email !== user.email) {
      // メールアドレスを更新
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .update({ email: user.email })
        .match({ id: user.id })
        .select('*')
        .single()

      profile = updatedProfile
    }
  }

  return <Header user={user} profile={profile} />
}

export default SupabaseListener
