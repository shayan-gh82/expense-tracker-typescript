import { ArrowLeftRight, Plus, WalletCards } from "lucide-react";
import walletsHero from "../assets/images/wallets-hero.webp";
import PageHero from "../components/ui/PageHero";
import TransferForm from "../components/wallets/TransferForm";
import WalletManager from "../components/wallets/WalletManager";
import { useFinance } from "../hooks/useFinance";
import { useI18n } from "../hooks/useI18n";
import { formatCurrency } from "../utils/formatters";

const Wallets = () => {
  const { t } = useI18n();
  const { walletBalances, transfers, settings } = useFinance();
  const total = walletBalances.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0);

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow={t("pages.wallets.eyebrow")}
        title={t("pages.wallets.title")}
        description={t("pages.wallets.description")}
        image={walletsHero}
        actions={[
          { label: t("forms.createWallet"), icon: <Plus size={18} />, onClick: () => window.scrollTo({ top: 520, behavior: "smooth" }) },
          { label: t("forms.transferMoney"), icon: <ArrowLeftRight size={18} />, variant: "secondary", onClick: () => window.scrollTo({ top: 1200, behavior: "smooth" }) },
        ]}
        stats={[
          { label: t("dashboard.totalBalance"), value: formatCurrency(total, settings.currency), meta: t("dashboard.walletsOverview") },
          { label: t("nav.wallets"), value: walletBalances.length, meta: "Active accounts" },
          { label: t("forms.transferHistory"), value: transfers.length, meta: "Internal transfers" },
        ]}
      />
      <WalletManager />
      <TransferForm />
    </div>
  );
};

export default Wallets;
