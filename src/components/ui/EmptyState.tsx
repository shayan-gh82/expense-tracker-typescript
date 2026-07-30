import { Sparkles } from "lucide-react";
import { useI18n } from "../../hooks/useI18n";

const EmptyState = ({ title, description }: { title?: string; description?: string }) => {
  const { t } = useI18n();

  return (
    <div className="soft-card flex min-h-52 flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-3xl bg-royal-primary/20 p-4 text-royal-secondary">
        <Sparkles size={32} />
      </div>
      <h3 className="text-lg font-bold text-royal-text">{title || t("common.emptyTitle")}</h3>
      <p className="mt-2 max-w-md text-sm text-royal-muted">{description || t("common.emptyDescription")}</p>
    </div>
  );
};

export default EmptyState;
