import { useI18n } from "../../hooks/useI18n";
import IconRenderer from "../common/IconRenderer";
import { getCategoryLabel } from "../../utils/i18nLabels";

const CategoryBadge = ({ category }) => {
  const { t } = useI18n();

  if (!category) return <span className="badge">{t("common.unknown")}</span>;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
      style={{ backgroundColor: `${category.color}20`, color: category.color }}
    >
      <IconRenderer name={category.icon} size={14} />
      {getCategoryLabel(category, t)}
    </span>
  );
};

export default CategoryBadge;
