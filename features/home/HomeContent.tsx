import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const HomeContent = () => {
  return (
    <div className='grid grid-cols-2 items-center' style={{ height: 'calc(100vh - 120px)' }}>
      <div className='text-center'>
      <h2 className='text-7xl font-bold'>MoneyMate</h2>
      <p className='text-xl mt-10'>Your Best Partner in Household Budgeting</p>
      </div>
      <div className='h-full'>
        <img src="/Home.png" alt="" className='h-full'/>
      </div>
    </div>
  )
}

export default HomeContent
