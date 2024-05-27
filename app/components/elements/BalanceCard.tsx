import React from "react";

type Props = {
  income: number;
  expense: number;
  balance: number;
}

const BalanceCard = ({ income, expense, balance }: Props) => {
  return (
    <div className="flex justify-between items-center px-10 mt-10">
      <div className="w-[30%] bg-blue p-5 text-center text-white rounded-lg">
        <h2 className="text-2xl">Income</h2>
        <p className="text-3xl mt-3">¥{income}</p>
      </div>
      <div className="w-[30%] bg-red p-5 text-center text-white rounded-lg">
        <h2 className="text-2xl">Expense</h2>
        <p className="text-3xl mt-3">¥{expense}</p>
      </div>
      <div className="w-[30%] bg-green p-5 text-center text-white rounded-lg">
        <h2 className="text-2xl">Balance</h2>
        <p className="text-3xl mt-3">¥{balance}</p>
      </div>
    </div>
  );
};

export default BalanceCard;
