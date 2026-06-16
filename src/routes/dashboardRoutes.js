import { RxDashboard } from "react-icons/rx";
import AccountDetails from "../pages/dashboard/balances/AccountDetails";
import Balances from "../pages/dashboard/balances/Balances";
import Bills from "../pages/dashboard/bills/Bills";
import Expenses from "../pages/dashboard/expenses/Expenses";
import Goals from "../pages/dashboard/goals/Goals";
import Overview from "../pages/dashboard/overview/Overview";
import Settings from "../pages/dashboard/settings/Settings";
import Transactions from "../pages/dashboard/transactions/Transactions";
import { LuSettings, LuWallet } from "react-icons/lu";
import { GrTransaction } from "react-icons/gr";
import { TbMoneybagMove, TbReportMoney } from "react-icons/tb";
import { TfiTarget } from "react-icons/tfi";

export const dashboardRoutes = [
  {
    path: "overview",
    element: Overview,
    title: "Overview",
    icon: RxDashboard,
    showInSidebar: true,
  },
  {
    path: "balances",
    element: Balances,
    title: "Balances",
    icon: LuWallet,
    showInSidebar: true,
  },
  {
    path: "balances/account/details/:id",
    element: AccountDetails,
    title: "Account Details",
    showInSidebar: false,
  },
  {
    path: "transactions",
    element: Transactions,
    title: "Transactions",
    icon: GrTransaction,
    showInSidebar: true,
    defaultQuery: '?tab=all'
  },
  {
    path: "bills",
    element: Bills,
    title: "Bills",
    icon: TbReportMoney,
    showInSidebar: true,
  },
  {
    path: "expenses",
    element: Expenses,
    title: "Expenses",
    icon: TbMoneybagMove,
    showInSidebar: true,
  },
  {
    path: "goals",
    element: Goals,
    title: "Goals",
    icon: TfiTarget,
    showInSidebar: true,
  },
  {
    path: "settings",
    element: Settings,
    title: "Settings",
    icon: LuSettings,
    showInSidebar: true,
    defaultQuery: '?tab=account'
  },
];
