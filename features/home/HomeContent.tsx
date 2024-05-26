import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const HomeContent = () => {
  return (
    <div className='text-center mt-40'>
      <h2 className='text-7xl'>Household Budget Pro</h2>
      <p className='text-3xl mt-10'>Supports Easy and Fast Household Budget Management</p>
      <div className='mt-10'>
      <Link href='/auth/login'><Button className='mr-4 bg-accentColor w-60 hover:bg-subColor'>Login</Button></Link>
      <Link href='/auth/signup'><Button className='ml-4 bg-subColor w-60 hover:bg-accentColor'>Sign up</Button></Link>
      </div>
    </div>
  )
}

export default HomeContent
