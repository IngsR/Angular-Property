export interface KprInput {
  propertyPrice: number; // in IDR
  downPaymentPercent: number; // e.g. 20 (meaning 20%)
  downPaymentAmount: number; // calculated or custom in IDR
  interestRateAnnualPercent: number; // e.g. 5.5 (meaning 5.5% annual)
  loanDurationYears: number; // e.g. 15 or 20
  fixedPeriodYears?: number; // e.g. 3 years fixed, remainder floating
  floatingRateAnnualPercent?: number; // optional floating rate
}

export interface KprAmortizationYear {
  year: number;
  principalPaidYear: number;
  interestPaidYear: number;
  remainingPrincipal: number;
}

export interface KprResult {
  propertyPrice: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  loanPrincipal: number;
  annualInterestRate: number;
  loanDurationYears: number;
  loanDurationMonths: number;
  monthlyInstallment: number;
  totalPayment: number;
  totalInterest: number;
  recommendedMinimumIncome: number; // Rule of thumb: installment should be max 30-35% of monthly income
  schedule: KprAmortizationYear[];
  isValid: boolean;
  validationErrors: string[];
}
