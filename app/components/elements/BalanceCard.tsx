import React from "react";

type Props = {
  income: number;
  expense: number;
  balance: number;
  currencySymbol: string; // 通貨シンボルを追加
}

const BalanceCard = ({ income, expense, balance, currencySymbol }: Props) => {
  return (
    <div className="flex flex-col justify-between items-center mt-5">
      <div className="w-full my-2 bg-blue p-5 text-center text-white rounded-lg">
        <h2 className="text-2xl">Income</h2>
        <p className="text-3xl mt-3">{currencySymbol}{income.toFixed(2)}</p>
      </div>
      <div className="w-full my-2 bg-red p-5 text-center text-white rounded-lg">
        <h2 className="text-2xl">Expense</h2>
        <p className="text-3xl mt-3">{currencySymbol}{expense.toFixed(2)}</p>
      </div>
      <div className="w-full my-2 bg-green p-5 text-center text-white rounded-lg">
        <h2 className="text-2xl">Balance</h2>
        <p className="text-3xl mt-3">{currencySymbol}{balance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default BalanceCard;
