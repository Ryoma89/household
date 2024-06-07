'use client'

import { FormEvent, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Loading from '@/app/loading'
import type { Database } from '@/lib/database.types'

// Logout
const Logout = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Submit
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Logout
      const { error } = await supabase.auth.signOut()

      // Error check
      if (error) {
        setMessage('An error occurred: ' + error.message)
        return
      }

      router.push('/')
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
      <div className="text-center mb-5">Do you want to logout?</div>
      {/* Logout button */}
      <form onSubmit={onSubmit}>
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-red hover:opacity-80 w-full rounded-full p-2 text-white text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </form>

      {message && <div className="my-5 text-center text-sm text-red-500">{message}</div>}
    </div>
  )
}

export default Logout
