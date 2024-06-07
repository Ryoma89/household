'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Loading from '@/app/loading'
import * as z from 'zod'
import type { Database } from '@/lib/database.types'
type Schema = z.infer<typeof schema>

// Define validation rules for input data
const schema = z
  .object({
    password: z.string().min(6, { message: 'Must be at least 6 characters.' }),
    confirmation: z.string().min(6, { message: 'Must be at least 6 characters.' }),
  })
  .refine((data) => data.password === data.confirmation, {
    message: 'New password and confirmation password do not match.',
    path: ['confirmation'], // Apply error message to the field
  })

// Change password
const Password = () => {
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
    defaultValues: { password: '', confirmation: '' },
    // Input validation
    resolver: zodResolver(schema),
  })

  // Submit
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)
    setMessage('')

    try {
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        setMessage('An error occurred: ' + error.message)
        return
      }

      reset()
      setMessage('Password has been successfully updated.')
    } catch (error) {
      setMessage('An error occurred: ' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div>
      <div className="text-center font-bold text-xl mb-10">Change Password</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* New password */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">New Password</div>
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="New Password"
            id="password"
            {...register('password', { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.password?.message}</div>
        </div>

        {/* Confirmation password */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">Confirmation Password</div>
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="Confirmation Password"
            id="confirmation"
            {...register('confirmation', { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">
            {errors.confirmation?.message}
          </div>
        </div>

        {/* Change button */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-buttonPrimary hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              Change
            </button>
          )}
        </div>

        {/* Message */}
        {message && <div className="text-center text-sm text-red-500">{message}</div>}
      </form>
    </div>
  )
}

export default Password
