import { useState } from "react";
import { Bell, CheckCircle2, Languages, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { useReminderNotifications } from "../../hooks/useReminderNotifications";
import { getReminderStatus } from "../../utils/calculations";
import Button from "../ui/Button";
import { navItems } from "./Sidebar";

const Header = ({ activePage, onNavigate, onOpenMobileMenu }) => {
  const { settings, updateSettings, reminders, upcomingReminders, currentUser } = useFinance();
  const { t, language } = useI18n();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { permission, requestPermission } = useReminderNotifications({ reminders, currentUser, t });
  const page = navItems.find((item) => item.id === activePage);
  const isLight = settings.theme === "light";
  const initials = (currentUser?.name || settings.userName || "S").slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-royal-border/20 bg-royal-bg/70 px-4 py-4 backdrop-blur-2xl lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="!p-2 lg:hidden" onClick={onOpenMobileMenu} aria-label="Open menu"><Menu size={22} /></Button>
          <div>
            <p className="text-xs text-royal-muted">{t("app.currentPage")}</p>
            <h2 className="text-lg font-bold text-royal-text">{page?.labelKey ? t(page.labelKey) : "Dashboard"}</h2>
          </div>
        </div>

        <div className="hidden min-w-[260px] flex-1 justify-center xl:flex">
          <button type="button" onClick={() => onNavigate("transactions")} className="field flex max-w-lg items-center gap-3 !py-2.5 text-start">
            <Search size={18} className="text-royal-muted" />
            <span className="text-sm text-royal-muted">{t("common.searchPlaceholder")}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button type="button" className="badge relative" onClick={() => setIsNotificationsOpen((value) => !value)} aria-label={t("notifications.title")}>
              <Bell size={15} />
              <span className="hidden sm:inline">{upcomingReminders.length} {t("app.upcomingReminders")}</span>
              {upcomingReminders.some((item) => ["overdue", "dueToday"].includes(getReminderStatus(item))) && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-royal-expense shadow-glow" />}
            </button>

            {isNotificationsOpen && (
              <div className="absolute end-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] rounded-3xl border border-royal-border/20 bg-royal-surface/95 p-4 shadow-card backdrop-blur-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-royal-text">{t("notifications.title")}</h3>
                    <p className="text-xs text-royal-muted">{t("notifications.description")}</p>
                  </div>
                  {permission !== "granted" && permission !== "unsupported" && (
                    <Button variant="secondary" className="!px-3 !py-2 text-xs" onClick={requestPermission}>{t("notifications.enable")}</Button>
                  )}
                </div>

                <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
                  {upcomingReminders.slice(0, 8).map((reminder) => {
                    const status = getReminderStatus(reminder);
                    return (
                      <button key={reminder.id} type="button" className="soft-card flex w-full items-start gap-3 p-3 text-start" onClick={() => { setIsNotificationsOpen(false); onNavigate("reminders"); }}>
                        <div className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${status === "overdue" ? "bg-royal-expense/15 text-royal-expense" : status === "dueToday" ? "bg-royal-warning/15 text-royal-warning" : "bg-royal-primary/15 text-royal-secondary"}`}>
                          {status === "upcoming" ? <Bell size={16} /> : <CheckCircle2 size={16} />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-royal-text">{reminder.title}</p>
                          <p className="mt-1 text-xs text-royal-muted">{reminder.nextDate} · {t(`notifications.${status}`)}</p>
                        </div>
                      </button>
                    );
                  })}
                  {!upcomingReminders.length && <p className="rounded-2xl border border-dashed border-royal-border/20 p-5 text-center text-sm text-royal-muted">{t("dashboard.noUpcoming")}</p>}
                </div>
              </div>
            )}
          </div>

          <Button variant="secondary" className="hidden !px-4 !py-2 md:inline-flex" onClick={() => onNavigate("transactions")}><Plus size={18} /><span>{t("app.quickAdd")}</span></Button>
          <Button variant="secondary" className="!px-3 !py-2" onClick={() => updateSettings({ language: language === "fa" ? "en" : "fa" })} aria-label="Change language"><Languages size={18} /><span className="hidden sm:inline">{language === "fa" ? "EN" : "FA"}</span></Button>
          <Button variant="secondary" className="!px-3 !py-2" onClick={() => updateSettings({ theme: isLight ? "dark" : "light" })} aria-label="Change theme">{isLight ? <Moon size={18} /> : <Sun size={18} />}<span className="hidden sm:inline">{isLight ? t("app.dark") : t("app.light")}</span></Button>
          <button type="button" onClick={() => onNavigate("settings")} className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-royal-border/20 bg-royal-primary/15 text-sm font-black text-royal-text shadow-soft" aria-label={t("nav.settings")}>
            {currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /> : initials}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
