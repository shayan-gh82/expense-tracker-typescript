import { useI18n } from "../../hooks/useI18n";
import EmptyState from "../ui/EmptyState";
import TransactionItem from "./TransactionItem";

const TransactionList = ({ transactions, onEdit }) => {
  const { t } = useI18n();
  if (!transactions.length) {
    return <EmptyState title={t("common.noTransactions")} description={t("common.noTransactionsDesc")} />;
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default TransactionList;
