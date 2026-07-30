import { useRef, useState } from "react";
import { Download, FileText, LoaderCircle, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { createUserBackup } from "../../utils/backup";
import {
  exportTransactionsToCsv,
  parseTransactionsCsv,
  removeDuplicateTransactions,
} from "../../utils/csv";
import { exportReportToPdf, importBackupFromPdf } from "../../utils/pdf";
import Button from "../ui/Button";
import ExpensePieChart from "../dashboard/ExpensePieChart";
import IncomeExpenseLineChart from "../dashboard/IncomeExpenseLineChart";
import PrintableReport from "./PrintableReport";

const ReportsPanel = () => {
  const {
    currentUser,
    transactions,
    categories,
    wallets,
    transfers,
    reminders,
    totals,
    settings,
    importTransactions,
    replaceUserData,
  } = useFinance();
  const { t } = useI18n();
  const csvInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const reportRef = useRef(null);
  const [busyAction, setBusyAction] = useState("");

  const backup = () =>
    createUserBackup({ user: currentUser, transactions, categories, wallets, transfers, reminders });

  const handleCsvExport = () => {
    if (!transactions.length) {
      toast.error(t("errors.noExportData"));
      return;
    }

    exportTransactionsToCsv(
      transactions,
      categories,
      wallets,
      `expense-tracker-${currentUser?.name || "user"}-transactions`
    );
    toast.success(t("toast.csvExported"));
  };

  const handleCsvImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusyAction("csv-import");

    try {
      const result = parseTransactionsCsv(await file.text(), categories, wallets);
      const uniqueTransactions = removeDuplicateTransactions(result.valid, transactions);
      const duplicateCount = result.valid.length - uniqueTransactions.length;

      if (!uniqueTransactions.length) {
        toast.error(result.invalid.length ? t("errors.noValidCsv") : t("errors.allCsvDuplicates"));
        return;
      }

      importTransactions(uniqueTransactions);
      toast.success(
        t("toast.csvImportSummary", {
          imported: uniqueTransactions.length,
          invalid: result.invalid.length,
          duplicates: duplicateCount,
        })
      );
    } catch (error) {
      console.error(error);
      toast.error(t("errors.csvImportFailed"));
    } finally {
      setBusyAction("");
      event.target.value = "";
    }
  };

  const handlePdfExport = async () => {
    if (!transactions.length) {
      toast.error(t("errors.noExportData"));
      return;
    }

    setBusyAction("pdf-export");
    try {
      await exportReportToPdf({
        element: reportRef.current,
        backup: backup(),
        fileName: `expense-tracker-${currentUser?.name || "user"}-report`,
      });
      toast.success(t("toast.pdfExported"));
    } catch (error) {
      console.error(error);
      toast.error(t("errors.pdfExportFailed"));
    } finally {
      setBusyAction("");
    }
  };

  const handlePdfImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusyAction("pdf-import");

    try {
      const { data } = await importBackupFromPdf(file);
      const shouldReplace = window.confirm(t("reports.pdfReplaceConfirm"));
      if (!shouldReplace) return;
      replaceUserData(data);
    } catch (error) {
      console.error(error);
      if (error?.message === "PDF_NOT_CREATED_BY_APP") toast.error(t("errors.pdfNotCreatedByApp"));
      else toast.error(t("errors.pdfImportFailed"));
    } finally {
      setBusyAction("");
      event.target.value = "";
    }
  };

  const loadingIcon = <LoaderCircle size={18} className="animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-bold text-royal-text">{t("reports.importExport")}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-royal-muted">{t("reports.importExportDescription")}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Button variant="secondary" onClick={() => csvInputRef.current?.click()} disabled={Boolean(busyAction)}>
              {busyAction === "csv-import" ? loadingIcon : <Upload size={18} />}
              {t("reports.importCsv")}
            </Button>
            <Button variant="secondary" onClick={handleCsvExport} disabled={Boolean(busyAction)}>
              <Download size={18} />
              {t("reports.exportCsv")}
            </Button>
            <Button variant="secondary" onClick={() => pdfInputRef.current?.click()} disabled={Boolean(busyAction)}>
              {busyAction === "pdf-import" ? loadingIcon : <FileText size={18} />}
              {t("reports.importPdf")}
            </Button>
            <Button onClick={handlePdfExport} disabled={Boolean(busyAction)}>
              {busyAction === "pdf-export" ? loadingIcon : <Download size={18} />}
              {t("reports.exportPdf")}
            </Button>
          </div>

          <input ref={csvInputRef} type="file" accept=".csv,text/csv" onChange={handleCsvImport} className="hidden" />
          <input ref={pdfInputRef} type="file" accept=".pdf,application/pdf" onChange={handlePdfImport} className="hidden" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ExpensePieChart />
        <IncomeExpenseLineChart />
      </div>

      <div className="overflow-x-auto rounded-[2rem]">
        <PrintableReport
          reportRef={reportRef}
          currentUser={currentUser}
          transactions={transactions}
          categories={categories}
          wallets={wallets}
          totals={totals}
          settings={settings}
          t={t}
        />
      </div>
    </div>
  );
};

export default ReportsPanel;
