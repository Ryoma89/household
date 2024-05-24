import Title from "@/app/components/elements/Title";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MultiBalance = () => {
  return (
    <section className="p-10">
      <Title title="Multi Currency Balance" />
      <div className="mt-10">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5"></TableHead>
              <TableHead className="w-1/5">Income</TableHead>
              <TableHead className="w-1/5">Expense</TableHead>
              <TableHead className="w-1/5">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Japanese Yen(YPY)</TableCell>
              <TableCell className="font-medium">¥1,000</TableCell>
              <TableCell>¥1,000</TableCell>
              <TableCell>¥0</TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                Canadian Dollar (CAD)
              </TableCell>
              <TableCell className="font-medium">$1,000</TableCell>
              <TableCell>$1,000</TableCell>
              <TableCell>$0</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default MultiBalance;
