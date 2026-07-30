import { LogOut, Save } from "lucide-react";
import settingsHero from "../assets/images/settings-hero.webp";
import SettingsPanel from "../components/settings/SettingsPanel";
import PageHero from "../components/ui/PageHero";
import { useFinance } from "../hooks/useFinance";
import { useI18n } from "../hooks/useI18n";

const Settings = () => {
  const { t } = useI18n();
  const { currentUser, settings } = useFinance();

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow={t("pages.settings.eyebrow")}
        title={t("pages.settings.title")}
        description={t("pages.settings.description")}
        image={settingsHero}
        actions={[
          { label: t("settings.saveSettings"), icon: <Save size={18} />, onClick: () => window.scrollTo({ top: 560, behavior: "smooth" }) },
          { label: t("common.logout"), icon: <LogOut size={18} />, variant: "secondary", onClick: () => window.scrollTo({ top: 560, behavior: "smooth" }) },
        ]}
        stats={[
          { label: t("settings.userName"), value: currentUser?.name || settings.userName || "Shayan", meta: currentUser?.email || "Local account" },
          { label: t("settings.language"), value: (settings.language || "en").toUpperCase(), meta: t("app.language") },
          { label: t("settings.theme"), value: settings.theme || "dark", meta: t("settings.theme") },
        ]}
      />
      <SettingsPanel />
    </div>
  );
};

export default Settings;
