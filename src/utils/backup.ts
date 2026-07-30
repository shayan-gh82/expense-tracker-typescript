export const BACKUP_KIND = "expense-tracker-pro-user-backup";
export const BACKUP_VERSION = 1;

export const createUserBackup = ({ user, transactions, categories, wallets, transfers, reminders }) => ({
  kind: BACKUP_KIND,
  version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  user: {
    name: user?.name || "User",
    email: user?.email || "",
  },
  data: {
    transactions,
    categories: categories.filter((item) => !item.isDefault),
    wallets,
    transfers,
    reminders,
  },
});

export const validateUserBackup = (backup) => {
  if (!backup || backup.kind !== BACKUP_KIND || backup.version !== BACKUP_VERSION) {
    throw new Error("INVALID_BACKUP_FORMAT");
  }

  const data = backup.data;
  if (!data || !Array.isArray(data.transactions) || !Array.isArray(data.wallets)) {
    throw new Error("INVALID_BACKUP_DATA");
  }

  return {
    transactions: data.transactions,
    categories: Array.isArray(data.categories) ? data.categories : [],
    wallets: data.wallets,
    transfers: Array.isArray(data.transfers) ? data.transfers : [],
    reminders: Array.isArray(data.reminders) ? data.reminders : [],
  };
};
