import { formatRupiah, formatArea, formatNumber, formatPercent } from '../utils/formatters';

/**
 * Rupiah Pipe / Formatter
 * Prepares standard pipe transformation for Angular migration (e.g. `{{ price | rupiah }}`)
 */
export function rupiahPipe(value: number, compact = false): string {
  return formatRupiah(value, compact);
}

export function areaPipe(value: number): string {
  return formatArea(value);
}

export function numberPipe(value: number): string {
  return formatNumber(value);
}

export function percentPipe(value: number, decimals = 1): string {
  return formatPercent(value, decimals);
}
