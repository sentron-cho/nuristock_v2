export const parseNumber = (input?: string | null): number | undefined => {
  if (!input) return undefined;
  const raw = input.replace(/[^\d.-]/g, "");
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
};