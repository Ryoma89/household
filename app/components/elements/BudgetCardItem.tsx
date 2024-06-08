import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  title: string;
  amount: number;
  currencySymbol: string;
  textColor: string;
};

const BudgetCardItem = ({ title, amount, currencySymbol, textColor }: Props) => {
  return (
    <div className="text-center">
      <Card>
        <CardHeader>
          <CardTitle className={`text-2xl text-center font-extrabold ${textColor}`}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl">{currencySymbol}{amount !== undefined ? amount.toFixed(2) : "0.00"}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetCardItem;
