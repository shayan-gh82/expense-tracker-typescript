import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { formatCurrency } from "../../utils/formatters";
import IconRenderer from "../common/IconRenderer";
import { getWalletLabel, getWalletTypeLabel } from "../../utils/i18nLabels";

const WalletOverview = () => {
  const { walletBalances, settings } = useFinance();
  const { t } = useI18n();

  return (
    <div className="glass-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-royal-text">{t("dashboard.walletsOverview")}</h2>
        <p className="text-sm text-royal-muted">{t("dashboard.walletsDescription")}</p>
      </div>

      <div className="space-y-3">
        {walletBalances.map((wallet) => (
          <div key={wallet.id} className="flex items-center justify-between gap-4 rounded-2xl bg-royal-primary/5 p-4 transition hover:bg-royal-primary/10">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ backgroundColor: `${wallet.color}24`, color: wallet.color }}>
                <IconRenderer name={wallet.icon} size={20} />
              </div>
              <div>
                <p className="font-bold text-royal-text">{getWalletLabel(wallet, t)}</p>
                <p className="text-xs text-royal-muted">{getWalletTypeLabel(wallet.type, t)}</p>
              </div>
            </div>
            <p className="text-end font-black text-royal-text">{formatCurrency(wallet.balance, settings.currency)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletOverview;
