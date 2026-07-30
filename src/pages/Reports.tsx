import { Download, Upload } from "lucide-react";
import reportsHero from "../assets/images/reports-hero.webp";
import ReportsPanel from "../components/reports/ReportsPanel";
import PageHero from "../components/ui/PageHero";
import { useFinance } from "../hooks/useFinance";
import { useI18n } from "../hooks/useI18n";
import { formatCurrency } from "../utils/formatters";

const Reports = () => {
  const { t } = useI18n();
  const { totals, transactions, settings } = useFinance();
  const net = totals.income - totals.expense;

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow={t("pages.reports.eyebrow")}
        title={t("pages.reports.title")}
        description={t("pages.reports.description")}
        image={reportsHero}
        actions={[
          { label: t("reports.exportCsv"), icon: <Download size={18} />, onClick: () => window.scrollTo({ top: 560, behavior: "smooth" }) },
          { label: t("reports.importCsv"), icon: <Upload size={18} />, variant: "secondary", onClick: () => window.scrollTo({ top: 560, behavior: "smooth" }) },
        ]}
        stats={[
          { label: t("dashboard.totalIncome"), value: formatCurrency(totals.income, settings.currency), meta: t("common.income"), tone: "text-royal-income" },
          { label: t("dashboard.totalExpense"), value: formatCurrency(totals.expense, settings.currency), meta: t("common.expense"), tone: "text-royal-expense" },
          { label: t("dashboard.netFlow"), value: formatCurrency(net, settings.currency), meta: `${transactions.length} ${t("dashboard.transactions")}` },
        ]}
      />
      <ReportsPanel />
    </div>
  );
};

export default Reports;
