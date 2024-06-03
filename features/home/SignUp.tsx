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

type Schema = z.infer<typeof schema>

// Define validation rules for input data
const schema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email format.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
})

// Signup
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
    // Initial values
    defaultValues: { name: '', email: '', password: '' },
    // Input validation
    resolver: zodResolver(schema),
  })

  // Submit
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)

    try {
      // Signup
      const { error: errorSignup } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      // Error check
      if (errorSignup) {
        setMessage('An error occurred: ' + errorSignup.message)
        return
      }

      // Update profile name
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name: data.name })
        .eq('email', data.email)

      // Error check
      if (updateError) {
        setMessage('An error occurred: ' + updateError.message)
        return
      }

      // Clear input form
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
        {/* Name */}
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

        {/* Email */}
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

        {/* Password */}
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

        {/* Signup button */}
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
