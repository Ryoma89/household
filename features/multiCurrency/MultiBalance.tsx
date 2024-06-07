'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Title from '@/app/components/elements/Title';
import { currencies, getCurrencySymbol } from '@/constants/currencies';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useStore from '@/store';
import SelectMonth from '@/app/components/elements/SelectMonth';


const MultiBalance = () => {
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState<string[]>([]);
  const { transactions, fetchTransactions, selectedMonth } = useStore();
  const userId = useStore((state) => state.user.id);
  const [exchangeRates, setExchangeRates] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [userId, fetchTransactions]);

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrencies((prevSelected) =>
      prevSelected.includes(currency)
        ? prevSelected.filter((c) => c !== currency)
        : [...prevSelected, currency]
    );
  };

  const applyFilter = () => {
    setFilteredCurrencies(selectedCurrencies);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      const uniqueDates = [...new Set(transactions.map((t) => t.date))];
      uniqueDates.forEach((date) => {
        fetchExchangeRates(date);
      });
    }
  }, [transactions]);

  const fetchExchangeRates = async (date: string) => {
    try {
      const url = `/api/exchangeRates?date=${date}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setExchangeRates((prevRates) => ({
          ...prevRates,
          [date]: data.rates,
        }));
      } else {
        console.error('Failed to fetch exchange rates for date:', date);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const calculateTotals = (currency: string) => {
    let totalIncome = 0;
    let totalExpense = 0;

    // 選択された月のトランザクションのみをフィルタリング
    const filteredTransactions = transactions.filter(transaction => 
      transaction !== null && transaction !== undefined &&
      transaction.date.startsWith(selectedMonth)
    );

    filteredTransactions.forEach((transaction) => {
      const date = transaction.date;
      const rates = exchangeRates[date];
      if (rates) {
        const rate = rates[transaction.currency];
        if (rate) {
          const convertedAmount = transaction.amount / rate;
          const currencyRate = rates[currency];
          if (currencyRate) {
            const finalAmount = convertedAmount * currencyRate;

            if (transaction.type.toLowerCase() === 'income') {
              totalIncome += finalAmount;
            } else if (transaction.type.toLowerCase() === 'expense') {
              totalExpense += finalAmount;
            }
          } else {
            console.warn(`No rate found for currency ${currency} on date ${date}`);
          }
        } else {
          console.warn(`No rate found for currency ${transaction.currency} on date ${date}`);
        }
      } else {
        console.warn(`No rates found for date ${date}`);
      }
    });

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense
    };
  };

  return (
    <section className="p-10">
      <Title title="Multi Currency Balance" />
      <SelectMonth /> {/* Use SelectMonth component */}
      <Card className="mt-10 max-w-screen-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Select Currency</CardTitle>
          <CardDescription className="text-center">
            Choose the currencies you want to include in your financial overview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 max-w-screen-md mx-auto">
            {currencies.map((currency) => (
              <div key={currency} className="">
                <input
                  id={currency}
                  type="checkbox"
                  name="currency"
                  value={currency}
                  className="mr-2"
                  onChange={() => handleCurrencyChange(currency)}
                  checked={selectedCurrencies.includes(currency)}
                />
                <label htmlFor={currency} className="text-lg font-medium">
                  {currency}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-28 mx-auto">
            <Button className="bg-buttonPrimary w-28" onClick={applyFilter}>
              Apply
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5">Currency</TableHead>
              <TableHead className="w-1/5">Income</TableHead>
              <TableHead className="w-1/5">Expense</TableHead>
              <TableHead className="w-1/5">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCurrencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No currencies selected
                </TableCell>
              </TableRow>
            ) : (
              filteredCurrencies.map((currency) => {
                const totals = calculateTotals(currency);
                return (
                  <TableRow key={currency}>
                    <TableCell className="font-medium">{currency}</TableCell>
                    <TableCell className="font-medium">{getCurrencySymbol(currency)}{totals.income.toFixed(2)}</TableCell>
                    <TableCell>{getCurrencySymbol(currency)}{totals.expense.toFixed(2)}</TableCell>
                    <TableCell>{getCurrencySymbol(currency)}{totals.balance.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default MultiBalance;
