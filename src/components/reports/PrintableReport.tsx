import { formatCurrency, formatDate } from "../../utils/formatters";

const PrintableReport = ({ reportRef, currentUser, transactions, categories, wallets, totals, settings, t }) => {
  const categoryName = (id) => categories.find((item) => item.id === id)?.name || "—";
  const walletName = (id) => wallets.find((item) => item.id === id)?.name || "—";
  const balance = totals.income - totals.expense;

  return (
    <div className="glass-card overflow-hidden p-4 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-black text-royal-text">{t("reports.previewTitle")}</h2>
        <p className="mt-1 text-sm text-royal-muted">{t("reports.previewDescription")}</p>
      </div>

      <div ref={reportRef} className="mx-auto w-full min-w-[900px] bg-white p-10 text-slate-900" dir={settings.language === "fa" ? "rtl" : "ltr"}>
        <header className="flex items-start justify-between border-b-2 border-violet-700 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">Expense Tracker Pro</p>
            <h1 className="mt-2 text-3xl font-black">{t("reports.financialReport")}</h1>
            <p className="mt-2 text-sm text-slate-500">{currentUser?.name || "User"} · {currentUser?.email || t("auth.localAccount")}</p>
          </div>
          <div className="text-end text-sm text-slate-500">
            <p>{t("reports.generatedAt")}</p>
            <p className="mt-1 font-bold text-slate-800">{new Date().toLocaleString(settings.language === "fa" ? "fa-IR" : "en-US")}</p>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("dashboard.totalIncome")}</p>
            <p className="mt-3 text-xl font-black text-emerald-800">{formatCurrency(totals.income, settings.currency)}</p>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">{t("dashboard.totalExpense")}</p>
            <p className="mt-3 text-xl font-black text-rose-800">{formatCurrency(totals.expense, settings.currency)}</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-700">{t("dashboard.totalBalance")}</p>
            <p className="mt-3 text-xl font-black text-violet-800">{formatCurrency(balance, settings.currency)}</p>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black">{t("pages.transactions.title")}</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{transactions.length} {t("dashboard.transactions")}</span>
          </div>

          <table className="w-full border-collapse overflow-hidden text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-3 text-start">#</th>
                <th className="p-3 text-start">{t("common.title")}</th>
                <th className="p-3 text-start">{t("common.type")}</th>
                <th className="p-3 text-start">{t("common.category")}</th>
                <th className="p-3 text-start">{t("common.wallet")}</th>
                <th className="p-3 text-start">{t("common.date")}</th>
                <th className="p-3 text-end">{t("common.amount")}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={transaction.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border-b border-slate-200 p-3 text-slate-500">{index + 1}</td>
                  <td className="border-b border-slate-200 p-3 font-bold">{transaction.title}</td>
                  <td className="border-b border-slate-200 p-3 capitalize">{transaction.type === "income" ? t("common.income") : t("common.expense")}</td>
                  <td className="border-b border-slate-200 p-3">{categoryName(transaction.categoryId)}</td>
                  <td className="border-b border-slate-200 p-3">{walletName(transaction.walletId)}</td>
                  <td className="border-b border-slate-200 p-3">{formatDate(transaction.date, settings.language === "fa" ? "fa-IR" : "en-US")}</td>
                  <td className={`border-b border-slate-200 p-3 text-end font-black ${transaction.type === "income" ? "text-emerald-700" : "text-rose-700"}`}>
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount, settings.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!transactions.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">{t("common.noTransactions")}</div>
          )}
        </section>

        <footer className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
          <span>{t("reports.importablePdfNote")}</span>
          <span>Expense Tracker Pro · HW-L03-04</span>
        </footer>
      </div>
    </div>
  );
};

export default PrintableReport;
