import { Receipt, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { formatCurrency } from "../../utils/formatters";

const cards = [
  { key: "balance", titleKey: "dashboard.totalBalance", icon: Wallet, color: "text-royal-secondary", ring: "bg-royal-secondary/12" },
  { key: "income", titleKey: "dashboard.totalIncome", icon: TrendingUp, color: "text-royal-income", ring: "bg-royal-income/12" },
  { key: "expense", titleKey: "dashboard.totalExpense", icon: TrendingDown, color: "text-royal-expense", ring: "bg-royal-expense/12" },
  { key: "count", titleKey: "dashboard.transactions", icon: Receipt, color: "text-royal-info", ring: "bg-royal-info/12" },
];

const SummaryCards = () => {
  const { totals, transactions, walletBalances, settings } = useFinance();
  const { t } = useI18n();
  const realWalletBalance = walletBalances.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0);

  const values = {
    balance: formatCurrency(realWalletBalance, settings.currency),
    income: formatCurrency(totals.income, settings.currency),
    expense: formatCurrency(totals.expense, settings.currency),
    count: transactions.length,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="stat-card">
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-royal-muted">{t(card.titleKey)}</p>
                <p className="mt-2 text-xl font-black text-royal-text md:text-2xl">{values[card.key]}</p>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${card.ring} ${card.color}`}>
                <Icon size={23} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
