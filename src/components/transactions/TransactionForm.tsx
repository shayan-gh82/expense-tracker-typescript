import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { toInputDate } from "../../utils/formatters";
import { getCategoryLabel, getWalletLabel } from "../../utils/i18nLabels";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

const createDefaultForm = (walletId = "", categoryId = "") => ({
  title: "",
  amount: "",
  type: "expense",
  categoryId,
  walletId,
  date: toInputDate(),
  note: "",
});

const TransactionForm = ({ editingTransaction, onFinishEditing }: { editingTransaction?: any; onFinishEditing?: () => void }) => {
  const { categories, wallets, addTransaction, updateTransaction } = useFinance();
  const { t } = useI18n();
  const [form, setForm] = useState(createDefaultForm(wallets[0]?.id, categories[0]?.id));

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === form.type),
    [categories, form.type]
  );

  useEffect(() => {
    if (editingTransaction) {
      setForm(editingTransaction);
      return;
    }

    setForm((prev) => ({
      ...prev,
      walletId: prev.walletId || wallets[0]?.id || "",
      categoryId: prev.categoryId || filteredCategories[0]?.id || "",
    }));
  }, [editingTransaction, wallets, filteredCategories]);

  useEffect(() => {
    if (!filteredCategories.some((category) => category.id === form.categoryId)) {
      setForm((prev) => ({ ...prev, categoryId: filteredCategories[0]?.id || "" }));
    }
  }, [filteredCategories, form.categoryId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.title.trim()) return t("errors.titleRequired");
    if (!form.amount || Number(form.amount) <= 0) return t("errors.amountPositive");
    if (!form.categoryId) return t("errors.categoryRequired");
    if (!form.walletId) return t("errors.walletRequired");
    if (!form.date) return t("errors.dateRequired");
    return null;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const error = validateForm();

    if (error) {
      toast.error(error);
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      amount: Number(form.amount),
    };

    if (editingTransaction) {
      updateTransaction(payload);
      onFinishEditing?.();
    } else {
      addTransaction(payload);
    }

    setForm(createDefaultForm(wallets[0]?.id, filteredCategories[0]?.id));
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-royal-text">{editingTransaction ? t("forms.editTransaction") : t("forms.createTransaction")}</h2>
        <p className="mt-1 text-sm text-royal-muted">{t("forms.transactionDesc")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label={t("forms.transactionTitle")} name="title" value={form.title} onChange={handleChange} placeholder={t("forms.placeholders.transactionTitle")} />
        <Input label={t("common.amount")} name="amount" type="number" min="0" value={form.amount} onChange={handleChange} placeholder="500000" />
        <Select label={t("common.type")} name="type" value={form.type} onChange={handleChange}>
          <option value="expense">{t("common.expense")}</option>
          <option value="income">{t("common.income")}</option>
        </Select>
        <Select label={t("common.category")} name="categoryId" value={form.categoryId} onChange={handleChange}>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>{getCategoryLabel(category, t)}</option>
          ))}
        </Select>
        <Select label={t("common.wallet")} name="walletId" value={form.walletId} onChange={handleChange}>
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>{getWalletLabel(wallet, t)}</option>
          ))}
        </Select>
        <Input label={t("common.date")} name="date" type="date" value={form.date} onChange={handleChange} />
        <div className="md:col-span-2">
          <Textarea label={t("common.note")} name="note" value={form.note || ""} onChange={handleChange} placeholder={t("forms.placeholders.optionalNote")} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="submit">
          <Save size={18} />
          {editingTransaction ? t("common.save") : t("forms.createTransaction")}
        </Button>
        {editingTransaction && (
          <Button variant="secondary" onClick={onFinishEditing}>{t("common.cancel")}</Button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;
