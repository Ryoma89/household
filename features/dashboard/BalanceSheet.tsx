import BalanceCard from '@/app/components/elements/BalanceCard'
import Title from '@/app/components/elements/Title'
import React from 'react'

const BalanceSheet = () => {
  return (
    <section className='p-10'>
      <Title title='BalanceSheet' />
      <BalanceCard />
    </section>
  )
}

export default BalanceSheet
