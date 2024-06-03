import MultiBalance from '@/features/multiCurrency/MultiBalance'
import React from 'react'
import Nav from '../components/layouts/Nav'
import { Separator } from '@/components/ui/separator'

const MultiCurrency = () => {
  return (
    <div>
      <Nav />
      <Separator />
      <MultiBalance />
    </div>
  )
}

export default MultiCurrency
