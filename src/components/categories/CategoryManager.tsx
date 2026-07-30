import { useState } from "react";
import { Palette, Plus, ShieldCheck, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import IconRenderer, { availableIcons } from "../common/IconRenderer";
import { getCategoryLabel, getIconLabel } from "../../utils/i18nLabels";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const defaultForm = { name: "", type: "expense", icon: "Wallet", color: "#C084FC" };
const suggestedColors = ["#FB7185", "#38BDF8", "#FBBF24", "#A78BFA", "#F472B6", "#10B981", "#60A5FA", "#34D399"];

const CategoryManager = () => {
  const { categories, addCategory, deleteCategory } = useFinance();
  const { t } = useI18n();
  const [form, setForm] = useState(defaultForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = form.name.trim();

    if (!name) return toast.error(t("errors.categoryNameRequired"));
    if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
      return toast.error(t("errors.categoryDuplicate"));
    }

    addCategory({ ...form, name });
    setForm(defaultForm);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleSubmit} className="glass-card p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-royal-primary/20 p-3 text-royal-secondary"><Palette size={22} /></div>
          <div>
            <h2 className="text-lg font-bold">{t("forms.createCategory")}</h2>
            <p className="text-sm text-royal-muted">{t("pages.categories.description")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input label={t("forms.categoryName")} name="name" value={form.name} onChange={handleChange} placeholder={t("forms.placeholders.categoryName")} />
          <Select label={t("forms.categoryType")} name="type" value={form.type} onChange={handleChange}>
            <option value="expense">{t("common.expense")}</option>
            <option value="income">{t("common.income")}</option>
          </Select>
          <Select label={t("forms.icon")} name="icon" value={form.icon} onChange={handleChange}>
            {availableIcons.map((icon) => <option key={icon} value={icon}>{getIconLabel(icon, t)}</option>)}
          </Select>
          <Input label={t("forms.color")} type="color" name="color" value={form.color} onChange={handleChange} className="h-14 p-2" />

          <div>
            <span className="label">{t("forms.suggestedColors")}</span>
            <div className="flex flex-wrap gap-2">
              {suggestedColors.map((color) => (
                <button key={color} type="button" aria-label={`Choose color ${color}`} className="h-9 w-9 rounded-full border border-white/20 transition hover:scale-110" style={{ backgroundColor: color }} onClick={() => setForm((previous) => ({ ...previous, color }))} />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full"><Plus size={18} />{t("forms.createCategory")}</Button>
        </div>
      </form>

      <div className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold">{t("forms.categories")}</h2>
          <p className="text-sm text-royal-muted">{t("forms.categoriesDesc")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="soft-card flex items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl" style={{ backgroundColor: `${category.color}24`, color: category.color }}>
                  <IconRenderer name={category.icon} size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-bold text-royal-text">{getCategoryLabel(category, t)}</p>
                    {category.isDefault && <span className="badge !px-2 !py-0.5 text-[10px] text-royal-secondary"><ShieldCheck size={11} />{t("common.default")}</span>}
                  </div>
                  <p className="text-xs capitalize text-royal-muted">{category.type === "expense" ? t("common.expense") : t("common.income")}</p>
                </div>
              </div>
              {!category.isDefault && (
                <button type="button" onClick={() => deleteCategory(category.id)} className="rounded-xl p-2 text-royal-muted transition hover:bg-royal-expense/20 hover:text-royal-expense" aria-label={t("common.delete")}>
                  <Trash2 size={17} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
