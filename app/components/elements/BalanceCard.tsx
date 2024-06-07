import React from "react";

type Props = {
  title: string;
  amount: number;
  currencySymbol: string;
  bgColor: string; // 背景色を追加
};

const BalanceCard = ({ title, amount, currencySymbol, bgColor }: Props) => {
  return (
    <div className={`w-full my-2 p-5 text-center text-white rounded-lg ${bgColor}`}>
      <h2 className="text-2xl">{title}</h2>
      <p className="text-3xl mt-3">
        {currencySymbol}
        {amount !== undefined ? amount.toFixed(2) : "0.00"}
      </p>
    </div>
  );
};

export default BalanceCard;
