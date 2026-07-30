import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { formatCurrency } from "../../utils/formatters";
import IconRenderer, { availableIcons } from "../common/IconRenderer";
import { getIconLabel, getWalletLabel, getWalletTypeLabel } from "../../utils/i18nLabels";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const defaultForm = {
  name: "",
  type: "bank",
  initialBalance: "",
  icon: "Wallet",
  color: "#7C3AED",
};

const WalletManager = () => {
  const { wallets, walletBalances, transactions, transfers, reminders, addWallet, deleteWallet, settings } = useFinance();
  const { t } = useI18n();
  const [form, setForm] = useState(defaultForm);

  const lockedWalletIds = useMemo(() => {
    const ids = new Set();
    transactions.forEach((transaction) => ids.add(transaction.walletId));
    transfers.forEach((transfer) => {
      ids.add(transfer.fromWalletId);
      ids.add(transfer.toWalletId);
    });
    reminders.forEach((reminder) => ids.add(reminder.walletId));
    return ids;
  }, [transactions, transfers, reminders]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error(t("errors.walletNameRequired"));
      return;
    }

    addWallet({ ...form, name: form.name.trim(), initialBalance: Number(form.initialBalance) || 0 });
    setForm(defaultForm);
  };

  const handleDelete = (walletId) => {
    if (lockedWalletIds.has(walletId)) {
      toast.error(t("errors.walletInUse"));
      return;
    }
    deleteWallet(walletId);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleSubmit} className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-royal-text">{t("forms.createWallet")}</h2>
          <p className="text-sm text-royal-muted">{t("pages.wallets.description")}</p>
        </div>

        <div className="space-y-4">
          <Input label={t("forms.walletName")} name="name" value={form.name} onChange={handleChange} placeholder={t("forms.placeholders.walletName")} />
          <Select label={t("forms.walletType")} name="type" value={form.type} onChange={handleChange}>
            <option value="bank">{getWalletTypeLabel("bank", t)}</option>
            <option value="cash">{getWalletTypeLabel("cash", t)}</option>
            <option value="card">{getWalletTypeLabel("card", t)}</option>
            <option value="saving">{getWalletTypeLabel("saving", t)}</option>
          </Select>
          <Input label={t("forms.initialBalance")} type="number" name="initialBalance" value={form.initialBalance} onChange={handleChange} placeholder={t("forms.placeholders.initialBalance")} />
          <Select label={t("forms.icon")} name="icon" value={form.icon} onChange={handleChange}>
            {availableIcons.map((icon) => (
              <option key={icon} value={icon}>{getIconLabel(icon, t)}</option>
            ))}
          </Select>
          <Input label={t("forms.color")} type="color" name="color" value={form.color} onChange={handleChange} className="h-14 p-2" />
          <Button type="submit" className="w-full">
            <Plus size={18} />
            {t("forms.createWallet")}
          </Button>
        </div>
      </form>

      <div className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-royal-text">{t("nav.wallets")}</h2>
          <p className="text-sm text-royal-muted">{t("dashboard.walletsDescription")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {walletBalances.map((wallet) => (
            <div key={wallet.id} className="soft-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: `${wallet.color}24`, color: wallet.color }}>
                    <IconRenderer name={wallet.icon} size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-royal-text">{getWalletLabel(wallet, t)}</p>
                    <p className="text-xs text-royal-muted">{getWalletTypeLabel(wallet.type, t)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(wallet.id)}
                  className="rounded-xl p-2 text-royal-muted transition hover:bg-royal-expense/20 hover:text-royal-expense"
                  aria-label="Delete wallet"
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <p className="mt-5 text-2xl font-black text-royal-text">{formatCurrency(wallet.balance, settings.currency)}</p>
              <p className="mt-1 text-xs text-royal-muted">{t("common.initial")}: {formatCurrency(wallet.initialBalance, settings.currency)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletManager;
