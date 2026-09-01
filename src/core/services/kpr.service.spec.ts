import { describe, it, expect } from 'bun:test';
import { calculateKpr, validateKprInput } from './kpr.service';

describe('validateKprInput', () => {
  it('should validate valid KPR input', () => {
    const valid = validateKprInput({
      propertyPrice: 500_000_000,
      downPaymentAmount: 100_000_000,
      interestRateAnnualPercent: 5.5,
      loanDurationYears: 20,
    });
    expect(valid.isValid).toBe(true);
    expect(valid.errors.length).toBe(0);
  });

  it('should reject non-positive property price', () => {
    const invalid = validateKprInput({
      propertyPrice: 0,
      downPaymentAmount: 0,
      interestRateAnnualPercent: 5.5,
      loanDurationYears: 20,
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });

  it('should reject down payment greater than or equal to property price', () => {
    const invalid = validateKprInput({
      propertyPrice: 500_000_000,
      downPaymentAmount: 500_000_000,
      interestRateAnnualPercent: 5.5,
      loanDurationYears: 20,
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors).toContain(
      'Uang Muka (DP) harus lebih kecil dari harga properti (minimal 5-10% sisa untuk KPR).'
    );
  });

  it('should reject invalid interest rates or tenors', () => {
    const invalid = validateKprInput({
      propertyPrice: 500_000_000,
      downPaymentAmount: 100_000_000,
      interestRateAnnualPercent: 40,
      loanDurationYears: 50,
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.length).toBe(2);
  });
});

describe('calculateKpr', () => {
  it('should calculate monthly installment accurately using annuity formula', () => {
    // Principal: 400,000,000 IDR, Rate: 6% p.a., Tenor: 10 years (120 months)
    const result = calculateKpr({
      propertyPrice: 500_000_000,
      downPaymentAmount: 100_000_000,
      downPaymentPercent: 20,
      interestRateAnnualPercent: 6,
      loanDurationYears: 10,
    });

    expect(result.isValid).toBe(true);
    expect(result.loanPrincipal).toBe(400_000_000);
    expect(result.loanDurationMonths).toBe(120);
    // Annuity formula for 400M at 6% p.a. over 10y gives ~4,440,828 IDR / month
    expect(result.monthlyInstallment).toBeGreaterThan(4_400_000);
    expect(result.monthlyInstallment).toBeLessThan(4_500_000);
    expect(result.totalPayment).toBe(result.monthlyInstallment * 120);
    expect(result.totalInterest).toBe(result.totalPayment - result.loanPrincipal);
    expect(result.schedule.length).toBe(10);
    // At end of schedule, remaining principal should be 0
    expect(result.schedule[result.schedule.length - 1].remainingPrincipal).toBe(0);
  });

  it('should handle zero interest rate gracefully', () => {
    const result = calculateKpr({
      propertyPrice: 600_000_000,
      downPaymentAmount: 120_000_000,
      downPaymentPercent: 20,
      interestRateAnnualPercent: 0,
      loanDurationYears: 20,
    });

    expect(result.isValid).toBe(true);
    expect(result.loanPrincipal).toBe(480_000_000);
    // 480,000,000 / 240 months = 2,000,000 / month
    expect(result.monthlyInstallment).toBe(2_000_000);
    expect(result.totalInterest).toBe(0);
  });
});
