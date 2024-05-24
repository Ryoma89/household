import PieChart from "@/features/dashboard/PieChart"
import Transaction from "@/features/dashboard/Transaction"
import DashboardList from "@/features/dashboard/DashboardList"
import BalanceSheet from "@/features/dashboard/BalanceSheet"
import Nav from "../components/layouts/Nav"


const HomePage = () => {
  return (
    <>
    <Nav />
    <div>
      <div className="grid grid-cols-2">
      <PieChart />
      <Transaction />
      </div>
      <BalanceSheet />
      <DashboardList />
    </div>
    </>
  )
}

export default HomePage
