import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  Globe2,
  LoaderCircle,
  Lock,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Wallet,
  WalletCards,
} from "lucide-react";
import loginHero from "../assets/images/login-hero.webp";
import { useFinance } from "../hooks/useFinance";
import { useI18n } from "../hooks/useI18n";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

const features = [
  { icon: WalletCards, labelKey: "auth.featureMultiWallet" },
  { icon: BarChart3, labelKey: "auth.featureSmartReports" },
  { icon: Bell, labelKey: "auth.featurePaymentReminders" },
];

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.19-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z" />
    <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.39 13.86A6 6 0 0 1 6.08 12c0-.65.11-1.28.31-1.86V7.52H3.04A10 10 0 0 0 2 12c0 1.61.39 3.13 1.04 4.48l3.35-2.62Z" />
    <path fill="#EA4335" d="M12 6.01c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.62C7.18 7.77 9.39 6.01 12 6.01Z" />
  </svg>
);

const Auth = () => {
  const { loginUser, registerUser, loginWithGoogle, settings, updateSettings } = useFinance();
  const { t, language, dir } = useI18n();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "shayan@example.com", password: "123456" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const themeClass = settings.theme === "light" ? "theme-light" : "theme-dark";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await loginUser({ email: form.email.trim(), password: form.password });
      } else {
        await registerUser({
          name: form.name.trim() || "New User",
          email: form.email.trim(),
          password: form.password,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`app-shell ${themeClass} min-h-screen p-4 md:p-6`} dir={dir} lang={language}>
      <div className="mx-auto grid min-h-[calc(100vh-48px)] w-full max-w-7xl items-center gap-6 lg:grid-cols-[1.04fr_0.96fr]">
        <section className="hero-card min-h-[620px] overflow-hidden p-0 lg:min-h-[740px]">
          <img src={loginHero} alt="Premium finance dashboard" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-royal-bg/35 via-royal-bg/25 to-royal-primary/20" />
          <div className="relative z-10 flex h-full min-h-[620px] flex-col justify-between p-6 sm:p-8 lg:min-h-[740px]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl">
                <ShieldCheck size={17} />
                {t("app.proVersion")}
              </div>
              <h1 className="max-w-2xl text-4xl font-black leading-tight text-white md:text-6xl">{t("auth.title")}</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/78 md:text-base">{t("auth.description")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {features.map(({ icon: Icon, labelKey }) => (
                <div key={labelKey} className="rounded-3xl border border-white/15 bg-black/30 p-4 text-white shadow-card backdrop-blur-2xl">
                  <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-royal-secondary">
                    <Icon size={20} />
                  </div>
                  <p className="text-sm font-black">{t(labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-card w-full p-6 sm:p-8 lg:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-royal-primary text-white shadow-glow">
              <Wallet size={30} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royal-secondary">{t("auth.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-black text-royal-text">{mode === "login" ? t("auth.login") : t("auth.register")}</h2>
            <p className="mt-2 text-sm text-royal-muted">{t("auth.localAuth")}</p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <Select label={t("auth.chooseLanguage")} value={settings.language || "en"} onChange={(event) => updateSettings({ language: event.target.value })}>
              <option value="en">English</option>
              <option value="fa">فارسی</option>
            </Select>
            <Select label={t("settings.theme")} value={settings.theme || "dark"} onChange={(event) => updateSettings({ theme: event.target.value })}>
              <option value="dark">{t("app.dark")}</option>
              <option value="light">{t("app.light")}</option>
            </Select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && <Input label={t("auth.name")} name="name" value={form.name} onChange={handleChange} placeholder="Shayan" required />}
            <Input label={t("auth.email")} name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label={t("auth.password")} name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
              {mode === "login" ? t("auth.login") : t("auth.register")}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-royal-muted">
            <span className="h-px flex-1 bg-royal-border/20" />
            {t("auth.or")}
            <span className="h-px flex-1 bg-royal-border/20" />
          </div>

          <Button type="button" variant="secondary" className="w-full" onClick={handleGoogleLogin} disabled={isSubmitting}>
            <GoogleMark />
            {t("auth.googleLogin")}
          </Button>

          <div className="mt-6 rounded-3xl border border-royal-border/20 bg-royal-primary/10 p-4 text-sm text-royal-muted">
            <div className="flex items-center gap-2 font-semibold text-royal-text">
              <Lock size={16} /> {t("auth.demoAccount")}
            </div>
            <p className="mt-2">{t("auth.email")}: shayan@example.com</p>
            <p>{t("auth.password")}: 123456</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Redux Toolkit", "Context API", "LocalStorage"].map((item) => (
              <div key={item} className="mini-metric text-center text-xs font-bold text-royal-muted">
                <Sparkles className="mx-auto mb-2 text-royal-secondary" size={16} />
                {item}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 text-center text-sm font-semibold text-royal-secondary hover:text-royal-text"
            onClick={() => setMode((previous) => (previous === "login" ? "register" : "login"))}
          >
            <Globe2 size={16} />
            {mode === "login" ? t("auth.needAccount") : t("auth.alreadyAccount")}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Auth;
