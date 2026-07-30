import { Crown, Sparkles } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import IconRenderer from "../common/IconRenderer";

const navItems = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: "LayoutDashboard" },
  { id: "transactions", labelKey: "nav.transactions", icon: "Receipt" },
  { id: "categories", labelKey: "nav.categories", icon: "ChartPie" },
  { id: "wallets", labelKey: "nav.wallets", icon: "WalletCards" },
  { id: "reminders", labelKey: "nav.reminders", icon: "Bell" },
  { id: "reports", labelKey: "nav.reports", icon: "BarChart3" },
  { id: "settings", labelKey: "nav.settings", icon: "Settings" },
];

const Sidebar = ({ activePage, onNavigate }) => {
  const { t } = useI18n();
  const { currentUser, settings } = useFinance();
  const displayName = currentUser?.name || settings.userName || "Shayan";

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-royal-border/20 bg-royal-surface/35 p-5 backdrop-blur-2xl lg:block rtl:border-l rtl:border-r-0">
      <div className="mb-8 flex items-center gap-3">
        <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-royal-primary to-royal-info text-white shadow-glow">
          <IconRenderer name="Wallet" size={24} />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-royal-income ring-4 ring-royal-bg" />
        </div>
        <div>
          <p className="text-lg font-black text-royal-text">{t("app.name")}</p>
          <p className="text-xs text-royal-muted">{t("app.subtitle")}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start text-sm font-semibold transition ${
                isActive ? "nav-item-active" : "nav-item-muted"
              }`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-2xl transition ${isActive ? "bg-white/18 text-white" : "bg-royal-primary/8 text-royal-muted group-hover:bg-royal-primary/12 group-hover:text-royal-secondary"}`}>
                <IconRenderer name={item.icon} size={18} />
              </span>
              {t(item.labelKey)}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 rounded-[1.75rem] border border-royal-border/20 bg-royal-primary/10 p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-royal-secondary/20 text-royal-secondary">
            <Crown size={19} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-royal-text">{displayName}</p>
            <p className="text-xs text-royal-muted">{t("app.premiumLocalAccount")}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 premium-card p-5">
        <div className="relative z-10">
          <div className="mb-3 inline-flex rounded-2xl bg-royal-secondary/15 p-2 text-royal-secondary">
            <Sparkles size={18} />
          </div>
          <p className="text-sm font-bold text-royal-text">{t("app.proTipTitle")}</p>
          <p className="mt-2 text-xs leading-5 text-royal-muted">{t("app.proTipText")}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
export { navItems };
