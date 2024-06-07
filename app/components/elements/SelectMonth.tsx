import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import useStore from '@/store'

const SelectMonth = () => {
  const { selectedMonth, setSelectedMonth } = useStore()

  const months = Array.from({ length: 12 }, (_, i) => {
    const year = new Date().getFullYear()
    const month = String(i + 1).padStart(2, '0')
    return `${year}-${month}`
  })

  return (
    <div className="flex justify-center items-center mb-5 mt-10">
      <Select onValueChange={(value) => setSelectedMonth(value)} value={selectedMonth}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>{selectedMonth}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectMonth
