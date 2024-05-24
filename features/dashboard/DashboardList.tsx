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

const DashboardList = () => {
  return (
    <section className="p-10">
      <Title title="Dashboard List" />
      <div className="mt-10">
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5">Date</TableHead>
            <TableHead className="w-1/5">Category</TableHead>
            <TableHead className="w-1/5">Amount</TableHead>
            <TableHead className="w-2/5">Content</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">2024-01-01</TableCell>
            <TableCell>Food</TableCell>
            <TableCell>¥100</TableCell>
            <TableCell className="w-2/5">restaurant</TableCell>
          </TableRow>
        </TableBody>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">2024-01-01</TableCell>
            <TableCell>Food</TableCell>
            <TableCell>¥100</TableCell>
            <TableCell className="w-2/5">restaurant</TableCell>
          </TableRow>
        </TableBody>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">2024-01-01</TableCell>
            <TableCell>Food</TableCell>
            <TableCell>¥100</TableCell>
            <TableCell className="w-2/5">restaurant</TableCell>
          </TableRow>
        </TableBody>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">2024-01-01</TableCell>
            <TableCell>Food</TableCell>
            <TableCell>¥100</TableCell>
            <TableCell className="w-2/5">restaurant</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </div>
    </section>
  );
};

export default DashboardList;
