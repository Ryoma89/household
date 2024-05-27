'use client'
import Link from 'next/link'
import useStore from '@/store'
import Image from 'next/image'
import { useEffect } from 'react'
import type { User } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'
type ProfileType = Database['public']['Tables']['profiles']['Row']

const Header = ({
  user,
  profile,
}: {
  user: User | null
  profile: ProfileType | null
}) => {
  const { setUser } = useStore()

  // 状態管理にユーザー情報を保存
  useEffect(() => {
    setUser({
      id: user ? user.id : '',
      email: user ? user.email! : '',
      name: user && profile ? profile.name : '',
      introduce: user && profile ? profile.introduce : '',
      avatar_url: user && profile ? profile.avatar_url : '',
    })
  }, [user, setUser, profile])

  return (
    <header className='flex justify-between items-center py-4 px-10 bg-mainColor text-white'>
      <h1 className='text-3xl'>Household Budget App</h1>
      {user ? (
            <div className="flex items-center space-x-5 text-xl">
              <Link href="/settings/profile">
                <div className="relative w-10 h-10">
                  <Image
                    src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
                    className="rounded-full object-cover"
                    alt="avatar"
                    fill
                  />
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              <Link href="/auth/login">ログイン</Link>
              <Link href="/auth/signup">サインアップ</Link>
            </div>
          )}
    </header>
  )
}

export default Header