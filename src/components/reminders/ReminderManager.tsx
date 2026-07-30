import { useMemo, useState } from "react";
import { AlertCircle, Bell, CheckCircle2, Clock3, PauseCircle, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { getReminderStatus } from "../../utils/calculations";
import { formatCurrency, formatDate, toInputDate } from "../../utils/formatters";
import { getCategoryLabel, getFrequencyLabel, getWalletLabel } from "../../utils/i18nLabels";
import CategoryBadge from "../categories/CategoryBadge";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

const defaultForm = {
  title: "",
  amount: "",
  type: "expense",
  categoryId: "",
  walletId: "",
  frequency: "monthly",
  nextDate: toInputDate(),
  note: "",
};

const statusMeta = {
  upcoming: { icon: Clock3, className: "text-royal-info", key: "notifications.upcoming" },
  dueToday: { icon: AlertCircle, className: "text-royal-warning", key: "notifications.dueToday" },
  overdue: { icon: AlertCircle, className: "text-royal-expense", key: "notifications.overdue" },
  paused: { icon: PauseCircle, className: "text-royal-muted", key: "notifications.paused" },
  invalid: { icon: AlertCircle, className: "text-royal-expense", key: "notifications.invalid" },
};

const ReminderManager = () => {
  const { categories, wallets, reminders, settings, addReminder, deleteReminder, toggleReminder, addReminderAsTransaction } = useFinance();
  const { t } = useI18n();
  const [form, setForm] = useState({
    ...defaultForm,
    categoryId: categories.find((category) => category.type === "expense")?.id || "",
    walletId: wallets[0]?.id || "",
  });

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === form.type),
    [categories, form.type]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "type" ? { categoryId: categories.find((category) => category.type === value)?.id || "" } : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return toast.error(t("errors.reminderTitleRequired"));
    if (!form.amount || Number(form.amount) <= 0) return toast.error(t("errors.amountPositive"));
    if (!form.categoryId) return toast.error(t("errors.categoryRequired"));
    if (!form.walletId) return toast.error(t("errors.walletRequired"));
    if (!form.nextDate) return toast.error(t("errors.dateRequired"));

    addReminder({ ...form, title: form.title.trim(), amount: Number(form.amount) });
    setForm((previous) => ({
      ...defaultForm,
      type: previous.type,
      categoryId: filteredCategories[0]?.id || "",
      walletId: wallets[0]?.id || "",
    }));
  };

  const getCategory = (id) => categories.find((category) => category.id === id);
  const getWalletName = (id) => getWalletLabel(wallets.find((wallet) => wallet.id === id), t);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleSubmit} className="glass-card p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-royal-warning/20 p-3 text-royal-warning"><Bell size={22} /></div>
          <div>
            <h2 className="text-lg font-bold text-royal-text">{t("forms.createReminder")}</h2>
            <p className="text-sm text-royal-muted">{t("pages.reminders.description")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input label={t("forms.reminderTitle")} name="title" value={form.title} onChange={handleChange} placeholder={t("forms.placeholders.reminderTitle")} />
          <Input label={t("common.amount")} type="number" min="1" name="amount" value={form.amount} onChange={handleChange} />
          <Select label={t("common.type")} name="type" value={form.type} onChange={handleChange}>
            <option value="expense">{t("common.expense")}</option>
            <option value="income">{t("common.income")}</option>
          </Select>
          <Select label={t("common.category")} name="categoryId" value={form.categoryId} onChange={handleChange}>
            {filteredCategories.map((category) => <option key={category.id} value={category.id}>{getCategoryLabel(category, t)}</option>)}
          </Select>
          <Select label={t("common.wallet")} name="walletId" value={form.walletId} onChange={handleChange}>
            {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{getWalletLabel(wallet, t)}</option>)}
          </Select>
          <Select label={t("forms.frequency")} name="frequency" value={form.frequency} onChange={handleChange}>
            <option value="weekly">{getFrequencyLabel("weekly", t)}</option>
            <option value="monthly">{getFrequencyLabel("monthly", t)}</option>
            <option value="yearly">{getFrequencyLabel("yearly", t)}</option>
          </Select>
          <Input label={t("forms.nextDate")} type="date" name="nextDate" value={form.nextDate} onChange={handleChange} />
          <Textarea label={t("common.note")} name="note" value={form.note} onChange={handleChange} />
          <Button type="submit" className="w-full"><Plus size={18} />{t("forms.createReminder")}</Button>
        </div>
      </form>

      <div className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-royal-text">{t("nav.reminders")}</h2>
          <p className="text-sm text-royal-muted">{t("pages.reminders.description")}</p>
        </div>

        <div className="space-y-3">
          {reminders.map((reminder) => {
            const status = getReminderStatus(reminder);
            const meta = statusMeta[status] || statusMeta.invalid;
            const StatusIcon = meta.icon;

            return (
              <div key={reminder.id} className="soft-card p-4 transition hover:bg-royal-primary/10">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-royal-text">{reminder.title}</p>
                      <CategoryBadge category={getCategory(reminder.categoryId)} />
                      <span className={`badge ${meta.className}`}><StatusIcon size={13} />{t(meta.key)}</span>
                    </div>
                    <p className="mt-2 text-sm text-royal-muted">
                      {formatCurrency(reminder.amount, settings.currency)} · {getWalletName(reminder.walletId)} · {t("common.due")} {formatDate(reminder.nextDate)} · {getFrequencyLabel(reminder.frequency, t)}
                    </p>
                    {reminder.note && <p className="mt-1 text-xs text-royal-muted">{reminder.note}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" className="!px-3 !py-2" onClick={() => toggleReminder(reminder.id)}>
                      {reminder.isActive ? t("notifications.pause") : t("notifications.activate")}
                    </Button>
                    <Button variant="secondary" className="!px-3 !py-2" onClick={() => addReminderAsTransaction(reminder.id)}>
                      <CheckCircle2 size={16} />{t("notifications.markPaid")}
                    </Button>
                    <button type="button" onClick={() => deleteReminder(reminder.id)} className="rounded-xl p-2 text-royal-muted transition hover:bg-royal-expense/20 hover:text-royal-expense" aria-label={t("common.delete")}><Trash2 size={17} /></button>
                  </div>
                </div>
              </div>
            );
          })}
          {!reminders.length && <p className="rounded-2xl border border-dashed border-royal-border/20 p-6 text-center text-sm text-royal-muted">{t("dashboard.noUpcomingDesc")}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReminderManager;
