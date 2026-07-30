import { Edit3, Trash2 } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { formatCurrency, formatDate } from "../../utils/formatters";
import CategoryBadge from "../categories/CategoryBadge";
import IconRenderer from "../common/IconRenderer";
import { getWalletLabel } from "../../utils/i18nLabels";

const TransactionItem = ({ transaction, onEdit }) => {
  const { categories, wallets, settings, deleteTransaction } = useFinance();
  const { t } = useI18n();
  const category = categories.find((item) => item.id === transaction.categoryId);
  const wallet = wallets.find((item) => item.id === transaction.walletId);
  const isIncome = transaction.type === "income";

  return (
    <div className="soft-card grid gap-4 p-4 transition hover:-translate-y-0.5 hover:bg-royal-primary/10 md:grid-cols-[1fr_auto] md:items-center">
      <div className="flex min-w-0 items-start gap-4">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
          style={{ backgroundColor: `${category?.color || "#C084FC"}22`, color: category?.color || "#C084FC" }}
        >
          <IconRenderer name={category?.icon || "Wallet"} size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-royal-text">{transaction.title}</h3>
            <CategoryBadge category={category} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-royal-muted">
            <span>{formatDate(transaction.date)}</span>
            <span>{t("common.wallet")}: {getWalletLabel(wallet, t)}</span>
            {transaction.note && <span>{t("common.note")}: {transaction.note}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 md:justify-end">
        <p className={`text-lg font-black ${isIncome ? "text-royal-income" : "text-royal-expense"}`}>
          {isIncome ? "+" : "-"}{formatCurrency(transaction.amount, settings.currency)}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-xl p-2 text-royal-muted transition hover:bg-royal-primary/10 hover:text-royal-text" onClick={() => onEdit(transaction)} aria-label="Edit transaction">
            <Edit3 size={17} />
          </button>
          <button type="button" className="rounded-xl p-2 text-royal-muted transition hover:bg-royal-expense/20 hover:text-royal-expense" onClick={() => deleteTransaction(transaction.id)} aria-label="Delete transaction">
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
