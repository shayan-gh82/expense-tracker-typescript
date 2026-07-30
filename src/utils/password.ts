export const hashPassword = async (password: string): Promise<string> => {
  const normalized = String(password || "");

  if (!globalThis.crypto?.subtle) {
    return btoa(unescape(encodeURIComponent(normalized)));
  }

  const bytes = new TextEncoder().encode(normalized);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};
