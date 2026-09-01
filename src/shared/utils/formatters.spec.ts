import { describe, it, expect } from 'bun:test';
import { formatRupiah, formatArea, formatNumber, formatPercent, slugify } from './formatters';

describe('formatters', () => {
  it('should format full rupiah currency properly', () => {
    const formatted = formatRupiah(750_000_000);
    expect(formatted).toContain('750.000.000');
  });

  it('should format compact rupiah currency properly', () => {
    expect(formatRupiah(1_500_000_000, true)).toContain('1,5 M');
    expect(formatRupiah(650_000_000, true)).toContain('650 Jt');
  });

  it('should format area with square meters', () => {
    expect(formatArea(120)).toBe('120 m²');
    expect(formatArea(0)).toBe('-');
  });

  it('should format percent', () => {
    expect(formatPercent(5.5)).toBe('5.5%');
    expect(formatPercent(20, 0)).toBe('20%');
  });

  it('should slugify strings', () => {
    expect(slugify('Rumah Minimalis Modern Padang')).toBe('rumah-minimalis-modern-padang');
    expect(slugify('Type 45 / 90 Hook')).toBe('type-45-90-hook');
  });
});
