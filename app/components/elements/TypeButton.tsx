import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

type Props = {
  setSelectedType: (type: "Income" | "Expense") => void;
}

const TypeButton = ({ setSelectedType }: Props) => {
  const [incomeType, setIncomeType] = useState(true); // State to track button type
  const [expenseType, setExpenseType] = useState(false); // State to track button type

  const handleIncomeClick = () => {
    setIncomeType(true);
    setExpenseType(false);
    setSelectedType("Income");
  };

  const handleExpenseClick = () => {
    setIncomeType(false);
    setExpenseType(true);
    setSelectedType("Expense");
  };

  return (
    <div className='mt-5 flex items-center justify-center'>
      <Button
        className={incomeType ? 'bg-blue rounded-r-none' : 'bg-gray-200 rounded-r-none'} // Set color based on state
        onClick={handleIncomeClick}
      >
        Income
      </Button>
      <Button
        className={expenseType ? 'bg-red rounded-l-none' : 'bg-gray-200 rounded-l-none'} // Set color based on state
        onClick={handleExpenseClick}
      >
        Expense
      </Button>
    </div>
  );
};

export default TypeButton;
