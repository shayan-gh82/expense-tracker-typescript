import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { formatCompactCurrency, formatCurrency } from "../../utils/formatters";
import EmptyState from "../ui/EmptyState";

const IncomeExpenseLineChart = () => {
  const { trendData, settings } = useFinance();
  const { t } = useI18n();

  return (
    <div className="glass-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-royal-text">{t("dashboard.incomeExpenseTrend")}</h2>
        <p className="text-sm text-royal-muted">{t("dashboard.trendDescription")}</p>
      </div>

      {trendData.length < 2 ? (
        <EmptyState title={t("dashboard.notEnoughData")} description={t("dashboard.notEnoughDataDesc")} />
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgb(var(--color-border) / 0.13)" strokeDasharray="5 5" />
              <XAxis dataKey="date" stroke="rgb(var(--color-text-muted))" fontSize={12} />
              <YAxis stroke="rgb(var(--color-text-muted))" fontSize={12} tickFormatter={(value) => formatCompactCurrency(value, settings.currency)} />
              <Tooltip
                formatter={(value) => formatCurrency(value, settings.currency)}
                contentStyle={{ background: "rgb(var(--color-surface))", border: "1px solid rgb(var(--color-border) / 0.2)", borderRadius: 16, color: "rgb(var(--color-text-main))" }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" name={t("common.income")} stroke="rgb(var(--color-income))" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="expense" name={t("common.expense")} stroke="rgb(var(--color-expense))" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default IncomeExpenseLineChart;
