import { RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const SettingsPanel = () => {
  const { settings, currentUser, updateSettings, resetData, logoutUser } = useFinance();
  const { t } = useI18n();
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateSettings(form);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
      <div className="glass-card p-6 xl:col-span-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-royal-text">{t("settings.userProfile")}</h2>
            <p className="mt-1 text-sm text-royal-muted">{t("settings.signedInAs")} {currentUser?.name} · {currentUser?.email}</p>
          </div>
          <Button variant="secondary" onClick={logoutUser}>{t("common.logout")}</Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-royal-text">{t("settings.appSettings")}</h2>
          <p className="mt-1 text-sm text-royal-muted">{t("settings.appSettingsDesc")}</p>
        </div>

        <div className="space-y-4">
          <Input label={t("settings.userName")} name="userName" value={form.userName || ""} onChange={handleChange} />
          <Select label={t("settings.currency")} name="currency" value={form.currency} onChange={handleChange}>
            <option value="IRR">IRR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </Select>
          <Select label={t("settings.language")} name="language" value={form.language || "en"} onChange={handleChange}>
            <option value="en">English</option>
            <option value="fa">فارسی</option>
          </Select>
          <Select label={t("settings.theme")} name="theme" value={form.theme} onChange={handleChange}>
            <option value="dark">{t("app.dark")}</option>
            <option value="light">{t("app.light")}</option>
          </Select>

          <Button type="submit">
            <Save size={18} />
            {t("settings.saveSettings")}
          </Button>
        </div>
      </form>

      <div className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-royal-text">{t("settings.demoData")}</h2>
          <p className="mt-1 text-sm text-royal-muted">{t("settings.demoDataDesc")}</p>
        </div>
        <Button variant="danger" onClick={resetData}>
          <RotateCcw size={18} />
          {t("settings.resetDemo")}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
