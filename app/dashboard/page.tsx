import PieChart from "@/features/chart/PieChart";
import Transaction from "@/features/dashboard/Transaction";
import DashboardList from "@/features/dashboard/DashboardList";
import BalanceSheet from "@/features/dashboard/BalanceSheet";
import Nav from "../components/layouts/Nav";
import { Separator } from "@/components/ui/separator";

const DashboardPage = async ({ user }: any) => {
  return (
    <>
      <Nav />
      <Separator />
      <div className="p-5">
        <div className="sm:grid sm:grid-cols-2 sm:grid-flow-row-dense">
          <div className="sm:order-2">
            <Transaction />
          </div>
          <div className="sm:order-1">
            <BalanceSheet />
          </div>
        </div>
        <DashboardList />
      </div>
    </>
  );
};

export default DashboardPage;
