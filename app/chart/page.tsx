import React from 'react'
import Nav from '../components/layouts/Nav'
import BarChart from '@/features/Chart/BarChart'
import MultiBalance from '@/features/Chart/MultiBalance'

const ChartPage = () => {
  return (
    <>
    <Nav />
    <div>
      <BarChart />
      <MultiBalance />
    </div>
    </>
  )
}

export default ChartPage