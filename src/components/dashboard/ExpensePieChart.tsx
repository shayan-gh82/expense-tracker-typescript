import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import { formatCompactCurrency, formatCurrency } from "../../utils/formatters";
import { getCategoryLabel } from "../../utils/i18nLabels";
import EmptyState from "../ui/EmptyState";

const ExpensePieChart = () => {
  const { expensesByCategory, settings, categories } = useFinance();
  const { t } = useI18n();
  const getExpenseCategoryName = (item) => getCategoryLabel(categories.find((category) => category.id === item.categoryId) || { id: item.categoryId, name: item.name }, t);
  const chartData = useMemo(() => expensesByCategory.map((item) => ({ ...item, displayName: getExpenseCategoryName(item) })), [expensesByCategory, categories, t]);

  return (
    <div className="glass-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-royal-text">{t("dashboard.expensesByCategory")}</h2>
        <p className="text-sm text-royal-muted">{t("dashboard.expensesDescription")}</p>
      </div>

      {!expensesByCategory.length ? (
        <EmptyState title={t("dashboard.noExpenses")} description={t("dashboard.noExpensesDesc")} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="amount" nameKey="displayName" innerRadius={65} outerRadius={105} paddingAngle={3}>
                  {chartData.map((entry) => (
                    <Cell key={entry.categoryId} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value, settings.currency)}
                  contentStyle={{ background: "rgb(var(--color-surface))", border: "1px solid rgb(var(--color-border) / 0.2)", borderRadius: 16, color: "rgb(var(--color-text-main))" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.categoryId} className="flex items-center justify-between gap-3 rounded-2xl bg-royal-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold text-royal-text">{item.displayName}</span>
                </div>
                <span className="text-xs text-royal-muted">{formatCompactCurrency(item.amount, settings.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensePieChart;
