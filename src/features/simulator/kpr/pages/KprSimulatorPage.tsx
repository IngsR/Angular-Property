import React, { useState } from 'react';
import { calculateKpr } from '../../../../core/services/kpr.service';
import { KprInput, KprResult } from '../../../../core/types/kpr.types';
import { formatRupiah } from '../../../../shared/utils/formatters';
import { Breadcrumbs } from '../../../../shared/components/Breadcrumbs';
import { Button } from '../../../../shared/ui/Button';
import {
  Calculator,
  DollarSign,
  Calendar,
  Percent,
  Wallet,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface KprSimulatorPageProps {
  initialPrice?: number;
  onNavigate: (path: string) => void;
}

export const KprSimulatorPage: React.FC<KprSimulatorPageProps> = ({
  initialPrice,
  onNavigate,
}) => {
  const defaultPrice = initialPrice || 850000000;
  const [propertyPrice, setPropertyPrice] = useState<number>(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(defaultPrice * 0.2);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [loanDurationYears, setLoanDurationYears] = useState<number>(20);
  const [showSchedule, setShowSchedule] = useState(false);

  // Sync DP amount when price or percent changes
  const handlePercentChange = (pct: number) => {
    setDownPaymentPercent(pct);
    setDownPaymentAmount(Math.round((propertyPrice * pct) / 100));
  };

  const handlePriceChange = (val: number) => {
    setPropertyPrice(val);
    setDownPaymentAmount(Math.round((val * downPaymentPercent) / 100));
  };

  const handleDpAmountChange = (amt: number) => {
    setDownPaymentAmount(amt);
    if (propertyPrice > 0) {
      setDownPaymentPercent(parseFloat(((amt / propertyPrice) * 100).toFixed(1)));
    }
  };

  const kprInput: KprInput = {
    propertyPrice,
    downPaymentPercent,
    downPaymentAmount,
    interestRateAnnualPercent: interestRate,
    loanDurationYears,
  };

  const result: KprResult = calculateKpr(kprInput);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Simulator KPR' }]} onNavigate={onNavigate} />

      {/* Hero Header */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator Finansial Standar Bank Indonesia</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Simulasi Angsuran & Kelayakan KPR
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Perhitungkan estimasi cicilan bulanan, rincian bunga, dan rekomendasi penghasilan minimum keluarga secara transparan dan akurat.
          </p>
        </div>
      </section>

      {/* Two Column Layout: Semantic Form on Left, Live Financial Result Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Form Semantics with Fieldsets */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <fieldset className="space-y-6">
              <legend className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 w-full flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span>Parameter Pinjaman KPR</span>
              </legend>

              {/* 1. Harga Properti */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="kpr-property-price" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Harga Properti (IDR)
                  </label>
                  <span className="text-sm font-extrabold text-blue-600">
                    {formatRupiah(propertyPrice)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    id="kpr-property-price"
                    type="number"
                    min="50000000"
                    step="10000000"
                    value={propertyPrice}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-2.5 rounded-full border border-slate-300 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {[500000000, 750000000, 1000000000, 1500000000, 2500000000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePriceChange(preset)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                        propertyPrice === preset
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {formatRupiah(preset, true)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Uang Muka (Down Payment) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="kpr-dp-amount" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Uang Muka / DP ({downPaymentPercent}%)
                  </label>
                  <span className="text-sm font-bold text-slate-900">
                    {formatRupiah(downPaymentAmount)}
                  </span>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      Rp
                    </span>
                    <input
                      id="kpr-dp-amount"
                      type="number"
                      min="0"
                      max={propertyPrice}
                      step="5000000"
                      value={downPaymentAmount}
                      onChange={(e) => handleDpAmountChange(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-2.5 rounded-full border border-slate-300 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {[10, 20, 30].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handlePercentChange(pct)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                          downPaymentPercent === pct
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={downPaymentPercent}
                  onChange={(e) => handlePercentChange(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* 3. Suku Bunga & Jangka Waktu (Tenor) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="kpr-interest-rate" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-blue-600" />
                    <span>Suku Bunga (% per tahun)</span>
                  </label>
                  <input
                    id="kpr-interest-rate"
                    type="number"
                    min="1"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                  <div className="flex gap-1">
                    {[4.75, 5.5, 6.75, 8.5].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setInterestRate(rate)}
                        className={`flex-1 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95 ${
                          interestRate === rate
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="kpr-loan-duration" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Jangka Waktu (Tahun)</span>
                  </label>
                  <input
                    id="kpr-loan-duration"
                    type="number"
                    min="1"
                    max="35"
                    step="1"
                    value={loanDurationYears}
                    onChange={(e) => setLoanDurationYears(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                  <div className="flex gap-1">
                    {[10, 15, 20, 25].map((tenor) => (
                      <button
                        key={tenor}
                        type="button"
                        onClick={() => setLoanDurationYears(tenor)}
                        className={`flex-1 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95 ${
                          loanDurationYears === tenor
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tenor} Th
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>
          </form>

          {/* Validation errors if any */}
          {!result.isValid && (
            <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Harap periksa isian parameter:</span>
              </div>
              <ul className="list-disc list-inside pl-1 space-y-0.5">
                {result.validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Financial Decision Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                Estimasi Cicilan Bulanan
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                {formatRupiah(result.monthlyInstallment)}
                <span className="text-sm font-medium text-slate-400"> / bulan</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tenor {result.loanDurationYears} tahun ({result.loanDurationMonths} bulan angsuran)
              </p>
            </div>

            {/* Financial Breakdown Items */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>Pokok Pinjaman KPR:</span>
                <span className="font-bold text-white">{formatRupiah(result.loanPrincipal)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Uang Muka (DP {result.downPaymentPercent.toFixed(0)}%):</span>
                <span className="font-bold text-white">{formatRupiah(result.downPaymentAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Estimasi Total Bunga:</span>
                <span className="font-bold text-amber-400">{formatRupiah(result.totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800">
                <span>Total Pengembalian:</span>
                <span className="font-extrabold text-white">{formatRupiah(result.totalPayment)}</span>
              </div>
            </div>

            {/* Income Recommendation Badge */}
            <div className="p-4 rounded-2xl bg-blue-950/80 border border-blue-800/80 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-blue-300 font-bold">
                <Wallet className="w-4 h-4 text-blue-400" />
                <span>Rekomendasi Penghasilan Keluarga:</span>
              </div>
              <p className="text-lg font-black text-white">
                ~ {formatRupiah(result.recommendedMinimumIncome)} / bulan
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Berdasarkan standar rasio cicilan maksimal 33% (Debt Service Ratio) untuk kemudahan persetujuan bank.
              </p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full font-bold shadow-md"
              onClick={() => onNavigate('/buy')}
            >
              Cari Properti Sesuai Budget KPR
            </Button>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Drawer / Expandable Table */}
      {result.schedule.length > 0 && (
        <section aria-labelledby="schedule-heading" className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="schedule-heading" className="text-lg font-bold text-slate-900">
                Jadwal Amortisasi Tahunan Pinjaman KPR
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rincian porsi pembayaran pokok versus bunga dari tahun pertama hingga akhir tenor.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              rightIcon={showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              onClick={() => setShowSchedule(!showSchedule)}
            >
              {showSchedule ? 'Sembunyikan Tabel' : 'Tampilkan Detail'}
            </Button>
          </div>

          {showSchedule && (
            <div className="overflow-x-auto pt-2 animate-fade-in">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th className="p-3">Tahun Ke</th>
                    <th className="p-3">Porsi Pokok Terbayar</th>
                    <th className="p-3">Porsi Bunga Terbayar</th>
                    <th className="p-3">Sisa Pokok Pinjaman</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {result.schedule.map((item) => (
                    <tr key={item.year} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900">Tahun {item.year}</td>
                      <td className="p-3 font-semibold text-emerald-600">
                        {formatRupiah(item.principalPaidYear)}
                      </td>
                      <td className="p-3 text-slate-600">
                        {formatRupiah(item.interestPaidYear)}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {formatRupiah(item.remainingPrincipal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
};
