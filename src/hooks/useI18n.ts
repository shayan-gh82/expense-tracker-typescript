import { useMemo } from "react";
import { useFinance } from "./useFinance";
import { languages, translate } from "../i18n/translations";

export const useI18n = () => {
  const { settings } = useFinance();
  const language = settings.language || "en";
  const meta = languages[language] || languages.en;

  return useMemo(
    () => ({
      language,
      dir: meta.dir,
      locale: meta.locale,
      isRtl: meta.dir === "rtl",
      languages,
      t: (path, values = {}) => translate(language, path, values),
    }),
    [language, meta]
  );
};
