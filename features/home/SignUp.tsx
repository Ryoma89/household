'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Loading from '@/app/loading'
import * as z from 'zod'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { currencies } from '@/constants/currencies' // 通貨リストをインポート

type Schema = z.infer<typeof schema>

// スキーマに primary_currency を追加
const schema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email format.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  primary_currency: z.string().min(3, { message: 'Please select a primary currency.' }) // 追加
})

const Signup = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { name: '', email: '', password: '', primary_currency: 'USD' }, // 初期値に primary_currency を追加
    resolver: zodResolver(schema),
  })

  // フォーム送信処理
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)

    try {
      // サインアップ処理
      const { data: signupData, error: errorSignup } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (errorSignup) {
        setMessage('An error occurred: ' + errorSignup.message)
        return
      }

      // プロフィール更新
      if (signupData.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ name: data.name, primary_currency: data.primary_currency }) // primary_currency を追加
          .eq('id', signupData.user.id) // ユーザーIDで更新
          
        if (updateError) {
          setMessage('An error occurred: ' + updateError.message)
          return
        }
      }

      reset()
      setMessage(
        'A confirmation email has been sent. Please check your email and click the URL to complete the registration.'
      )
    } catch (error) {
      setMessage('An error occurred: ' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div className="px-10 py-20 bg-white rounded-lg">
      <div className='w-3/5 mx-auto'>
        <div className="text-center font-bold text-2xl mb-10">Sign Up</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 名前 */}
          <div className="mb-3">
            <input
              type="text"
              className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
              placeholder="Name"
              id="name"
              {...register('name', { required: true })}
            />
            <div className="my-3 text-center text-sm text-red-500">{errors.name?.message}</div>
          </div>

          {/* メールアドレス */}
          <div className="mb-3">
            <input
              type="email"
              className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
              placeholder="Email"
              id="email"
              {...register('email', { required: true })}
            />
            <div className="my-3 text-center text-sm text-red-500">{errors.email?.message}</div>
          </div>

          {/* パスワード */}
          <div className="mb-5">
            <input
              type="password"
              className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
              placeholder="Password"
              id="password"
              {...register('password', { required: true })}
            />
            <div className="my-3 text-center text-sm text-red-500">{errors.password?.message}</div>
          </div>

          {/* 主な通貨の選択 */}
          <div className="mb-5">
            <select
              className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
              {...register('primary_currency', { required: true })}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <div className="my-3 text-center text-sm text-red-500">{errors.primary_currency?.message}</div>
          </div>

          {/* サインアップボタン */}
          <div className="mb-5">
            {loading ? (
              <Loading />
            ) : (
              <Button
                type="submit"
                className="font-bold bg-buttonPrimary w-full rounded-full p-2 text-white text-sm"
              >
                Sign Up
              </Button>
            )}
          </div>
        </form>

        {message && <div className="my-5 text-center text-sm text-red-500">{message}</div>}

        <div className="text-center text-sm">
          <Link href="/auth/login" className="text-gray-500 font-bold hover:opacity-70">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
