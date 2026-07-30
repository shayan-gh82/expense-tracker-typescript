import { useEffect, useState } from "react";
import { ArrowRightLeft, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { formatCurrency, formatDate, toInputDate } from "../../utils/formatters";
import { getWalletLabel } from "../../utils/i18nLabels";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

const TransferForm = () => {
  const { wallets, walletBalances, transfers, addTransfer, deleteTransfer, settings } = useFinance();
  const { t } = useI18n();
  const [form, setForm] = useState({
    fromWalletId: wallets[0]?.id || "",
    toWalletId: wallets[1]?.id || "",
    amount: "",
    date: toInputDate(),
    note: "",
  });

  useEffect(() => {
    setForm((previous) => ({
      ...previous,
      fromWalletId: wallets.some((item) => item.id === previous.fromWalletId) ? previous.fromWalletId : wallets[0]?.id || "",
      toWalletId: wallets.some((item) => item.id === previous.toWalletId) ? previous.toWalletId : wallets[1]?.id || "",
    }));
  }, [wallets]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (wallets.length < 2) return toast.error(t("errors.twoWalletsRequired"));
    if (!form.amount || Number(form.amount) <= 0) return toast.error(t("errors.transferAmountPositive"));
    if (form.fromWalletId === form.toWalletId) return toast.error(t("errors.differentWallets"));

    const created = addTransfer({ ...form, amount: Number(form.amount) });
    if (created) setForm((previous) => ({ ...previous, amount: "", note: "" }));
  };

  const walletLabel = (wallet) => `${getWalletLabel(wallet, t)} · ${formatCurrency(wallet.balance ?? 0, settings.currency)}`;
  const getWalletName = (id) => getWalletLabel(wallets.find((wallet) => wallet.id === id), t);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleSubmit} className="glass-card p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-royal-primary/20 p-3 text-royal-secondary"><ArrowRightLeft size={22} /></div>
          <div>
            <h2 className="text-lg font-bold text-royal-text">{t("forms.transferMoney")}</h2>
            <p className="text-sm text-royal-muted">{t("forms.transferDesc")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Select label={t("forms.fromWallet")} name="fromWalletId" value={form.fromWalletId} onChange={handleChange} disabled={wallets.length < 2}>
            {walletBalances.map((wallet) => <option key={wallet.id} value={wallet.id}>{walletLabel(wallet)}</option>)}
          </Select>
          <Select label={t("forms.toWallet")} name="toWalletId" value={form.toWalletId} onChange={handleChange} disabled={wallets.length < 2}>
            {walletBalances.map((wallet) => <option key={wallet.id} value={wallet.id}>{walletLabel(wallet)}</option>)}
          </Select>
          <Input label={t("common.amount")} type="number" min="1" name="amount" value={form.amount} onChange={handleChange} />
          <Input label={t("common.date")} type="date" name="date" value={form.date} onChange={handleChange} />
          <Textarea label={t("common.note")} name="note" value={form.note} onChange={handleChange} />
          <Button type="submit" className="w-full" disabled={wallets.length < 2}><ArrowRightLeft size={18} />{t("forms.transferMoney")}</Button>
          {wallets.length < 2 && <p className="text-center text-xs text-royal-warning">{t("errors.twoWalletsRequired")}</p>}
        </div>
      </form>

      <div className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-royal-text">{t("forms.transferHistory")}</h2>
          <p className="text-sm text-royal-muted">{t("forms.transferDesc")}</p>
        </div>
        <div className="space-y-3">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="soft-card flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-bold text-royal-text">{getWalletName(transfer.fromWalletId)} → {getWalletName(transfer.toWalletId)}</p>
                <p className="mt-1 text-xs text-royal-muted">{formatDate(transfer.date)} {transfer.note && `· ${transfer.note}`}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-black text-royal-text">{formatCurrency(transfer.amount, settings.currency)}</p>
                <button type="button" onClick={() => deleteTransfer(transfer.id)} className="rounded-xl p-2 text-royal-muted transition hover:bg-royal-expense/20 hover:text-royal-expense" aria-label={t("common.delete")}><Trash2 size={17} /></button>
              </div>
            </div>
          ))}
          {!transfers.length && <p className="rounded-2xl border border-dashed border-royal-border/20 p-6 text-center text-sm text-royal-muted">{t("common.emptyDescription")}</p>}
        </div>
      </div>
    </div>
  );
};

export default TransferForm;
