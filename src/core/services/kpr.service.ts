import { KprAmortizationYear, KprInput, KprResult } from '../types/kpr.types';

/**
 * Pure KPR calculation engine and validator
 */
export function validateKprInput(input: Partial<KprInput>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.propertyPrice || input.propertyPrice <= 0 || isNaN(input.propertyPrice)) {
    errors.push('Harga properti harus lebih besar dari Rp 0.');
  }

  if (input.downPaymentAmount !== undefined && input.propertyPrice !== undefined) {
    if (input.downPaymentAmount < 0) {
      errors.push('Uang Muka (DP) tidak boleh bernilai negatif.');
    }
    if (input.downPaymentAmount >= input.propertyPrice) {
      errors.push('Uang Muka (DP) harus lebih kecil dari harga properti (minimal 5-10% sisa untuk KPR).');
    }
  }

  if (
    input.interestRateAnnualPercent === undefined ||
    input.interestRateAnnualPercent < 0 ||
    isNaN(input.interestRateAnnualPercent) ||
    input.interestRateAnnualPercent > 30
  ) {
    errors.push('Suku bunga tahunan harus antara 0% hingga 30%.');
  }

  if (
    !input.loanDurationYears ||
    input.loanDurationYears < 1 ||
    input.loanDurationYears > 35 ||
    isNaN(input.loanDurationYears)
  ) {
    errors.push('Jangka waktu pinjaman (tenor) harus antara 1 hingga 35 tahun.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Pure function to calculate KPR mortgage payments (Annuity system standard in Indonesian Banks)
 */
export function calculateKpr(input: KprInput): KprResult {
  const validation = validateKprInput(input);
  const propertyPrice = Math.max(0, input.propertyPrice || 0);
  const downPaymentAmount = Math.max(0, input.downPaymentAmount || 0);
  const downPaymentPercent = propertyPrice > 0 ? (downPaymentAmount / propertyPrice) * 100 : 0;
  const loanPrincipal = Math.max(0, propertyPrice - downPaymentAmount);
  const annualInterestRate = Math.max(0, input.interestRateAnnualPercent || 0);
  const loanDurationYears = Math.max(1, input.loanDurationYears || 1);
  const totalMonths = loanDurationYears * 12;

  if (!validation.isValid || loanPrincipal <= 0) {
    return {
      propertyPrice,
      downPaymentAmount,
      downPaymentPercent,
      loanPrincipal,
      annualInterestRate,
      loanDurationYears,
      loanDurationMonths: totalMonths,
      monthlyInstallment: 0,
      totalPayment: 0,
      totalInterest: 0,
      recommendedMinimumIncome: 0,
      schedule: [],
      isValid: false,
      validationErrors: validation.errors,
    };
  }

  // Monthly interest rate
  const monthlyRate = annualInterestRate / 100 / 12;

  let monthlyInstallment = 0;
  if (monthlyRate === 0) {
    monthlyInstallment = loanPrincipal / totalMonths;
  } else {
    // Standard Annuity Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyInstallment = (loanPrincipal * (monthlyRate * factor)) / (factor - 1);
  }

  const roundedMonthlyInstallment = Math.round(monthlyInstallment);
  const totalPayment = roundedMonthlyInstallment * totalMonths;
  const totalInterest = totalPayment - loanPrincipal;
  const recommendedMinimumIncome = Math.round(roundedMonthlyInstallment * 3); // Rule: 30-33% DSR (Debt Service Ratio)

  // Generate Year-by-Year Amortization Schedule
  const schedule: KprAmortizationYear[] = [];
  let remainingPrincipal = loanPrincipal;

  for (let year = 1; year <= loanDurationYears; year++) {
    let principalPaidYear = 0;
    let interestPaidYear = 0;

    for (let m = 1; m <= 12; m++) {
      if (remainingPrincipal <= 0) break;
      const interestMonth = remainingPrincipal * monthlyRate;
      const principalMonth = Math.min(remainingPrincipal, monthlyInstallment - interestMonth);
      
      interestPaidYear += interestMonth;
      principalPaidYear += principalMonth;
      remainingPrincipal -= principalMonth;
    }

    schedule.push({
      year,
      principalPaidYear: Math.round(principalPaidYear),
      interestPaidYear: Math.round(interestPaidYear),
      remainingPrincipal: Math.max(0, Math.round(remainingPrincipal)),
    });
  }

  return {
    propertyPrice,
    downPaymentAmount,
    downPaymentPercent,
    loanPrincipal,
    annualInterestRate,
    loanDurationYears,
    loanDurationMonths: totalMonths,
    monthlyInstallment: Math.round(monthlyInstallment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    recommendedMinimumIncome: Math.round(recommendedMinimumIncome),
    schedule,
    isValid: true,
    validationErrors: [],
  };
}
