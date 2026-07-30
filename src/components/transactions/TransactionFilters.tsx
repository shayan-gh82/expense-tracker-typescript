import { Search, SlidersHorizontal } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { getCategoryLabel, getWalletLabel } from "../../utils/i18nLabels";

const TransactionFilters = ({ filters, onChange, onReset }) => {
  const { categories, wallets } = useFinance();
  const { t, isRtl } = useI18n();

  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-royal-primary/20 p-3 text-royal-secondary">
          <SlidersHorizontal size={20} />
        </div>
        <div>
          <h2 className="font-bold text-royal-text">{t("common.search")}</h2>
          <p className="text-sm text-royal-muted">{t("common.filterDescription")}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className={`pointer-events-none absolute top-[43px] text-royal-muted ${isRtl ? "right-4" : "left-4"}`} size={18} />
          <Input label={t("common.search")} name="search" value={filters.search} onChange={handleChange} placeholder={t("common.searchPlaceholder")} className={isRtl ? "pr-11" : "pl-11"} />
        </div>
        <Select label={t("common.type")} name="type" value={filters.type} onChange={handleChange}>
          <option value="all">{t("common.all")}</option>
          <option value="income">{t("common.income")}</option>
          <option value="expense">{t("common.expense")}</option>
        </Select>
        <Select label={t("common.category")} name="categoryId" value={filters.categoryId} onChange={handleChange}>
          <option value="all">{t("common.all")}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{getCategoryLabel(category, t)}</option>
          ))}
        </Select>
        <Select label={t("common.wallet")} name="walletId" value={filters.walletId} onChange={handleChange}>
          <option value="all">{t("common.all")}</option>
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>{getWalletLabel(wallet, t)}</option>
          ))}
        </Select>
        <Input label={t("common.minAmount")} name="minAmount" type="number" value={filters.minAmount} onChange={handleChange} />
        <Input label={t("common.maxAmount")} name="maxAmount" type="number" value={filters.maxAmount} onChange={handleChange} />
        <Input label={t("common.startDate")} name="startDate" type="date" value={filters.startDate} onChange={handleChange} />
        <Input label={t("common.endDate")} name="endDate" type="date" value={filters.endDate} onChange={handleChange} />
      </div>

      <div className="mt-4">
        <Button variant="secondary" onClick={onReset}>{t("common.resetFilters")}</Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
