import { useI18n } from "../../hooks/useI18n";
import Button from "./Button";

const PageHero = ({ eyebrow, title, description, image, imageAlt = "", actions = [], stats = [] }) => {
  const { t } = useI18n();

  return (
    <section className="hero-card overflow-hidden">
      <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          {eyebrow && <p className="text-xs font-black uppercase tracking-[0.28em] text-royal-secondary">{eyebrow}</p>}
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-royal-text md:text-5xl">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-sm leading-7 text-royal-muted md:text-base">{description}</p>}

          {!!actions.length && (
            <div className="mt-6 flex flex-wrap gap-3">
              {actions.map((action) => (
                <Button key={action.label} variant={action.variant || "primary"} onClick={action.onClick} className={action.className || ""}>
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {!!stats.length && (
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="soft-card p-4">
                  <p className="text-xs text-royal-muted">{stat.label}</p>
                  <p className="mt-1 text-lg font-black text-royal-text">{stat.value}</p>
                  {stat.meta && <p className={`mt-1 text-xs font-semibold ${stat.tone || "text-royal-secondary"}`}>{stat.meta}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {image && (
          <div className="relative min-h-[260px] lg:min-h-[360px]">
            <div className="hero-image-frame absolute inset-0">
              <img src={image} alt={imageAlt} className="h-full w-full object-cover" loading="eager" />
            </div>
            <div className="absolute -bottom-5 left-6 right-6 hidden rounded-3xl border border-white/15 bg-black/20 p-4 shadow-card backdrop-blur-xl md:block">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-royal-muted">{t("app.premiumUiEdition")}</p>
                  <p className="text-sm font-bold text-royal-text">{t("app.luxuryVisuals")}</p>
                </div>
                <span className="rounded-full bg-royal-income/15 px-3 py-1 text-xs font-bold text-royal-income">{t("app.versionLabel")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
