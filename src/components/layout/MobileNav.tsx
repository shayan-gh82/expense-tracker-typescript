import { X } from "lucide-react";
import { useI18n } from "../../hooks/useI18n";
import Button from "../ui/Button";
import IconRenderer from "../common/IconRenderer";
import { navItems } from "./Sidebar";

const MobileNav = ({ activePage, isOpen, onClose, onNavigate }) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden">
      <div className="h-full w-80 max-w-[90vw] border-r border-royal-border/20 bg-royal-surface p-5 shadow-card rtl:mr-auto rtl:border-l rtl:border-r-0 ltr:ml-0">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-royal-primary text-white">
              <IconRenderer name="Wallet" size={22} />
            </div>
            <div>
              <p className="font-black text-royal-text">{t("app.name")}</p>
              <p className="text-xs text-royal-muted">{t("app.subtitle")}</p>
            </div>
          </div>
          <Button variant="ghost" className="!p-2" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start text-sm font-semibold transition ${
                  isActive ? "nav-item-active" : "nav-item-muted"
                }`}
              >
                <IconRenderer name={item.icon} size={18} />
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
