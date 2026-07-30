import { Bell, CalendarClock } from "lucide-react";
import remindersHero from "../assets/images/reminders-hero.webp";
import ReminderManager from "../components/reminders/ReminderManager";
import PageHero from "../components/ui/PageHero";
import { useFinance } from "../hooks/useFinance";
import { useI18n } from "../hooks/useI18n";

const Reminders = () => {
  const { t } = useI18n();
  const { reminders, upcomingReminders } = useFinance();

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow={t("pages.reminders.eyebrow")}
        title={t("pages.reminders.title")}
        description={t("pages.reminders.description")}
        image={remindersHero}
        actions={[
          { label: t("forms.createReminder"), icon: <Bell size={18} />, onClick: () => window.scrollTo({ top: 560, behavior: "smooth" }) },
        ]}
        stats={[
          { label: t("nav.reminders"), value: reminders.length, meta: "Total reminders" },
          { label: t("dashboard.upcomingReminders"), value: upcomingReminders.length, meta: t("common.due"), tone: "text-royal-warning" },
          { label: "Schedule", value: "7 / 30", meta: "Due window", tone: "text-royal-info" },
        ]}
      />
      <ReminderManager />
    </div>
  );
};

export default Reminders;
