import { useState } from "react";
import { BarChart3, Bell, Plus, WalletCards } from "lucide-react";
import dashboardHero from "../assets/images/dashboard-hero.webp";
import ExpensePieChart from "../components/dashboard/ExpensePieChart";
import IncomeExpenseLineChart from "../components/dashboard/IncomeExpenseLineChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import ReminderOverview from "../components/dashboard/ReminderOverview";
import SummaryCards from "../components/dashboard/SummaryCards";
import WalletOverview from "../components/dashboard/WalletOverview";
import TransactionForm from "../components/transactions/TransactionForm";
import Modal from "../components/ui/Modal";
import PageHero from "../components/ui/PageHero";
import { useFinance } from "../hooks/useFinance";
import { useI18n } from "../hooks/useI18n";
import { formatCurrency } from "../utils/formatters";

const Dashboard = ({ onNavigate }) => {
  const { settings, currentUser, totals, walletBalances, upcomingReminders } = useFinance();
  const { t } = useI18n();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const displayName = currentUser?.name || settings.userName || "Shayan";
  const realWalletBalance = walletBalances.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0);
  const netFlow = totals.income - totals.expense;

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow={t("pages.dashboard.eyebrow")}
        title={t("pages.dashboard.title", { name: displayName })}
        description={t("pages.dashboard.description")}
        image={dashboardHero}
        imageAlt="Luxury finance dashboard"
        actions={[
          { label: t("app.quickAdd"), icon: <Plus size={18} />, onClick: () => onNavigate?.("transactions") },
          { label: t("nav.wallets"), icon: <WalletCards size={18} />, variant: "secondary", onClick: () => onNavigate?.("wallets") },
          { label: t("nav.reports"), icon: <BarChart3 size={18} />, variant: "secondary", onClick: () => onNavigate?.("reports") },
        ]}
        stats={[
          { label: t("dashboard.totalBalance"), value: formatCurrency(realWalletBalance, settings.currency), meta: t("dashboard.allWallets") },
          { label: t("dashboard.totalIncome"), value: formatCurrency(totals.income, settings.currency), meta: t("common.income"), tone: "text-royal-income" },
          { label: t("dashboard.upcomingReminders"), value: upcomingReminders.length, meta: t("common.due"), tone: "text-royal-warning" },
        ]}
      />

      <SummaryCards />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <IncomeExpenseLineChart />
        <div className="dashboard-grid-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-royal-muted">{t("dashboard.netFlow")}</p>
              <h2 className="text-2xl font-black text-royal-text">{formatCurrency(netFlow, settings.currency)}</h2>
            </div>
            <div className={`grid h-12 w-12 place-items-center rounded-2xl ${netFlow >= 0 ? "bg-royal-income/15 text-royal-income" : "bg-royal-expense/15 text-royal-expense"}`}>
              <BarChart3 size={22} />
            </div>
          </div>
          <p className="text-sm leading-6 text-royal-muted">
            {netFlow >= 0 ? t("dashboard.positiveCashFlow") : t("dashboard.negativeCashFlow")}
          </p>
          <div className="mt-5 rounded-3xl border border-royal-border/20 bg-royal-primary/10 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-royal-warning/15 text-royal-warning"><Bell size={20} /></div>
              <div>
                <p className="font-bold text-royal-text">{upcomingReminders.length} {t("app.upcomingReminders")}</p>
                <p className="text-xs text-royal-muted">{t("dashboard.upcomingDescription")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ExpensePieChart />
        <RecentTransactions onEdit={setEditingTransaction} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <WalletOverview />
        <ReminderOverview />
      </div>

      <Modal isOpen={Boolean(editingTransaction)} title={t("forms.editTransaction")} onClose={() => setEditingTransaction(null)}>
        <TransactionForm editingTransaction={editingTransaction} onFinishEditing={() => setEditingTransaction(null)} />
      </Modal>
    </div>
  );
};

export default Dashboard;
