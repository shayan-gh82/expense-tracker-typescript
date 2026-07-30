import CategoryManager from "../components/categories/CategoryManager";
import SectionHeader from "../components/ui/SectionHeader";
import { useI18n } from "../hooks/useI18n";

const Categories = () => {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={t("pages.categories.eyebrow")}
        title={t("pages.categories.title")}
        description={t("pages.categories.description")}
      />
      <CategoryManager />
    </div>
  );
};

export default Categories;
