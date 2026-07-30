import { useMemo, useState } from "react";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";
import Modal from "../components/ui/Modal";
import SectionHeader from "../components/ui/SectionHeader";
import { useFinance } from "../hooks/useFinance";
import { useI18n } from "../hooks/useI18n";
import { filterTransactions } from "../utils/calculations";
import type { TransactionFilters as TransactionFilterState } from "../types";

const defaultFilters: TransactionFilterState = {
  search: "",
  type: "all",
  categoryId: "all",
  walletId: "all",
  minAmount: "",
  maxAmount: "",
  startDate: "",
  endDate: "",
};

const Transactions = () => {
  const { transactions } = useFinance();
  const { t } = useI18n();
  const [filters, setFilters] = useState(defaultFilters);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const filteredTransactions = useMemo(() => filterTransactions(transactions, filters), [transactions, filters]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={t("pages.transactions.eyebrow")}
        title={t("pages.transactions.title")}
        description={t("pages.transactions.description")}
      />

      <TransactionForm editingTransaction={null} />
      <TransactionFilters filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
      <TransactionList transactions={filteredTransactions} onEdit={setEditingTransaction} />

      <Modal isOpen={Boolean(editingTransaction)} title={t("forms.editTransaction")} onClose={() => setEditingTransaction(null)}>
        <TransactionForm editingTransaction={editingTransaction} onFinishEditing={() => setEditingTransaction(null)} />
      </Modal>
    </div>
  );
};

export default Transactions;
