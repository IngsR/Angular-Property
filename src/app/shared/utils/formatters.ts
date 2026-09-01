/**
 * Utility formatters for Property Discovery & Decision Platform
 */

export function formatRupiah(amount: number, compact = false): string {
  if (isNaN(amount)) return 'Rp 0';

  if (compact) {
    if (amount >= 1_000_000_000) {
      const billions = amount / 1_000_000_000;
      return `Rp ${billions.toLocaleString('id-ID', { maximumFractionDigits: 2 })} M`;
    }
    if (amount >= 1_000_000) {
      const millions = amount / 1_000_000;
      return `Rp ${millions.toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
    }
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(m2: number): string {
  if (!m2 || isNaN(m2)) return '-';
  return `${m2} m²`;
}

export function formatNumber(num: number): string {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatPercent(percent: number, decimals = 1): string {
  if (isNaN(percent)) return '0%';
  return `${percent.toFixed(decimals)}%`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
