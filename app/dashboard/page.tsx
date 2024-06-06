import PieChart from "@/features/Chart/PieChart"
import Transaction from "@/features/dashboard/Transaction"
import DashboardList from "@/features/dashboard/DashboardList"
import BalanceSheet from "@/features/dashboard/BalanceSheet"
import Nav from "../components/layouts/Nav"
import { Separator } from "@/components/ui/separator"

const DashboardPage = async ({ user }: any) => {

  return (
    <>
    <Nav />
    <Separator />
    <div className="p-5">
      <div className="grid grid-cols-2">
      <BalanceSheet />
      <Transaction/>
      </div>
      <DashboardList />
    </div>
    </>
  )
}

export default DashboardPage
