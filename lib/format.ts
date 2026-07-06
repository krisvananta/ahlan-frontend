/**
 * Format a number as Indonesian Rupiah (IDR) currency.
 * Enforces "id-ID" locale per AGENTS.md §2.8 and CONTRIBUTING.md §4.2.
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string or Date object using the "id-ID" locale.
 * Enforces "id-ID" locale per AGENTS.md §2.8 and CONTRIBUTING.md §4.2.
 */
export function formatDateID(dateInput: string | Date | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";
  
  const defaultOptions: Intl.DateTimeFormatOptions = options || {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("id-ID", defaultOptions);
}
