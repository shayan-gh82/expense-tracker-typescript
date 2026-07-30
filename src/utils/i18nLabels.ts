const translatedOrFallback = (t, path, fallback) => {
  const value = t(path);
  return value === path ? fallback : value;
};

export const getCategoryLabel = (category, t) => {
  if (!category) return t("common.unknown");
  return translatedOrFallback(t, `entities.categories.${category.id}`, category.name);
};

export const getWalletLabel = (wallet, t) => {
  if (!wallet) return t("common.unknown");
  return translatedOrFallback(t, `entities.wallets.${wallet.id}`, wallet.name);
};

export const getWalletTypeLabel = (type, t) => translatedOrFallback(t, `entities.walletTypes.${type}`, type);

export const getFrequencyLabel = (frequency, t) => translatedOrFallback(t, `entities.frequencies.${frequency}`, frequency);

export const getIconLabel = (icon, t) => translatedOrFallback(t, `entities.icons.${icon}`, icon);
