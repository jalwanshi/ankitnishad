export type BulkImportRecord = Record<string, unknown>;

export function getString(
  record: BulkImportRecord,
  key: string,
  fallback = ""
): string {
  const value = record[key];
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

export function getBoolean(
  record: BulkImportRecord,
  key: string,
  fallback = false
): boolean {
  const value = record[key];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value !== "string") return fallback;

  const normalized = value.trim().toLowerCase();
  if (["true", "yes", "y", "1", "active", "published"].includes(normalized)) return true;
  if (["false", "no", "n", "0", "hidden", "draft"].includes(normalized)) return false;
  return fallback;
}

export function getNumber(
  record: BulkImportRecord,
  key: string,
  fallback: number
): number {
  const value = Number(record[key]);
  return Number.isFinite(value) ? value : fallback;
}

export function getStringList(
  record: BulkImportRecord,
  key: string
): string[] {
  const value = record[key];

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) return [];

  const trimmed = value.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Fall back to delimiter parsing below.
    }
  }

  return trimmed
    .split(/\r?\n|\s*\|\s*|\s*;\s*|\s*,\s*/)
    .map((item) => item.replace(/^[\s\-*•+]+/, "").trim())
    .filter(Boolean);
}

export function createSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function requireFields(
  record: BulkImportRecord,
  fields: string[],
  rowNumber: number
): void {
  const missing = fields.filter((field) => !getString(record, field));
  if (missing.length > 0) {
    throw new Error(`Row ${rowNumber}: missing ${missing.join(", ")}`);
  }
}
