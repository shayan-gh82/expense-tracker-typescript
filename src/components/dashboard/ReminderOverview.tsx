import { Bell } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getFrequencyLabel } from "../../utils/i18nLabels";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

const ReminderOverview = () => {
  const { upcomingReminders, settings, addReminderAsTransaction } = useFinance();
  const { t } = useI18n();

  return (
    <div className="glass-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-royal-text">{t("dashboard.upcomingReminders")}</h2>
        <p className="text-sm text-royal-muted">{t("dashboard.upcomingDescription")}</p>
      </div>

      {!upcomingReminders.length ? (
        <EmptyState title={t("dashboard.noUpcoming")} description={t("dashboard.noUpcomingDesc")} />
      ) : (
        <div className="space-y-3">
          {upcomingReminders.slice(0, 4).map((reminder) => (
            <div key={reminder.id} className="rounded-2xl bg-royal-warning/5 p-4 transition hover:bg-royal-warning/10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-royal-warning/20 p-3 text-royal-warning">
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-royal-text">{reminder.title}</p>
                    <p className="text-xs text-royal-muted">{t("common.due")}: {formatDate(reminder.nextDate)} · {getFrequencyLabel(reminder.frequency, t)}</p>
                    <p className="mt-1 text-sm font-semibold text-royal-text">{formatCurrency(reminder.amount, settings.currency)}</p>
                  </div>
                </div>
                <Button variant="secondary" className="!px-3 !py-2" onClick={() => addReminderAsTransaction(reminder.id)}>
                  {t("common.pay")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReminderOverview;
