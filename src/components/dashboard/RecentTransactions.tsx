import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import TransactionItem from "../transactions/TransactionItem";
import EmptyState from "../ui/EmptyState";

const RecentTransactions = ({ onEdit }) => {
  const { transactions } = useFinance();
  const { t } = useI18n();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="glass-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-royal-text">{t("dashboard.recentTransactions")}</h2>
        <p className="text-sm text-royal-muted">{t("dashboard.recentDescription")}</p>
      </div>

      {!recentTransactions.length ? (
        <EmptyState title={t("dashboard.noRecent")} />
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
