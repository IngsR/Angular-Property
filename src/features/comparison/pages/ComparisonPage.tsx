import React, { useEffect, useState } from 'react';
import { Property } from '../../../core/types/property.types';
import { propertyRepository } from '../../../core/repositories/property.repository';
import { formatRupiah } from '../../../shared/utils/formatters';
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { Modal } from '../../../shared/ui/Modal';
import {
  Scale,
  Trash2,
  Plus,
  Calculator,
  Bed,
  Bath,
  Maximize,
  Layers,
  Car,
  FileCheck,
  Building,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ComparisonPageProps {
  comparisonList: string[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onAddToCompare: (id: string) => void;
  onNavigate: (path: string) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  comparisonList,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCompare,
  onNavigate,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Strictly limit to max 2 properties
    const activeList = comparisonList.slice(0, 2);

    Promise.all([
      propertyRepository.getPropertiesByIds(activeList),
      propertyRepository.getProperties({ limit: 30 }),
    ]).then(([comparedData, allData]) => {
      if (isMounted) {
        setProperties(comparedData);
        setAllProperties(allData.properties);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [comparisonList]);

  if (properties.length === 0 && !loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Breadcrumbs items={[{ label: 'Komparasi Properti' }]} onNavigate={onNavigate} />
        <div className="py-12">
          <EmptyState
            title="Belum Ada Properti yang Dibandingkan"
            description="Pilih 2 properti dari katalog untuk membandingkan harga, spesifikasi arsitektur, dan simulasi cicilan KPR secara objektif."
            actionText="Jelajah & Pilih Properti"
            onAction={() => onNavigate('/buy')}
            customIcon={<Scale className="w-8 h-8 text-blue-600" />}
          />
        </div>
      </main>
    );
  }

  const availableToAdd = allProperties.filter((p) => !comparisonList.includes(p.id));

  // Attribute specifications helper
  const getAttributes = (prop: Property) => {
    const monthlyKpr = Math.round(
      (prop.price * 0.8 * (0.055 / 12)) / (1 - Math.pow(1 + 0.055 / 12, -240))
    );

    return [
      {
        key: 'price',
        label: 'Harga Jual Properti',
        value: formatRupiah(prop.price),
        rawNumber: prop.price,
        icon: Sparkles,
        isHighlight: true,
      },
      {
        key: 'kpr',
        label: 'Estimasi Cicilan KPR',
        value: `~${formatRupiah(monthlyKpr, true)}/bln`,
        subtext: 'DP 20% • Bunga 5.5% • 20 Thn',
        icon: Calculator,
      },
      {
        key: 'city',
        label: 'Wilayah / Lokasi',
        value: `${prop.location.district ? prop.location.district + ', ' : ''}${prop.location.city}`,
        icon: Building,
      },
      {
        key: 'lb',
        label: 'Luas Bangunan (LB)',
        value: `${prop.specification.buildingArea} m²`,
        rawNumber: prop.specification.buildingArea,
        icon: Maximize,
      },
      {
        key: 'lt',
        label: 'Luas Tanah (LT)',
        value: `${prop.specification.landArea} m²`,
        rawNumber: prop.specification.landArea,
        icon: Layers,
      },
      {
        key: 'rooms',
        label: 'Kamar Tidur / Mandi',
        value: `${prop.specification.bedrooms} KT • ${prop.specification.bathrooms} KM`,
        icon: Bed,
      },
      {
        key: 'floors',
        label: 'Tingkat Lantai & Parkir',
        value: `${prop.specification.floors} Lantai • ${prop.specification.parking} Mobil`,
        icon: Car,
      },
      {
        key: 'cert',
        label: 'Legalitas Sertifikat',
        value: prop.specification.certificate || 'SHM (Hak Milik)',
        icon: FileCheck,
      },
      {
        key: 'developer',
        label: 'Pengembang / Mitra',
        value: prop.partner?.name || 'Mitra Mandiri Terverifikasi',
        icon: ShieldCheck,
      },
    ];
  };

  const propA = properties[0];
  const propB = properties[1] || null;

  return (
    <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      <Breadcrumbs items={[{ label: 'Komparasi Properti' }]} onNavigate={onNavigate} />

      {/* Page Header Bar */}
      <section className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Matriks Komparasi Properti</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                {properties.length}/2
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Perbandingan objektif spesifikasi fisik, denah, dan estimasi finansial antara 2 properti pilihan
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {properties.length < 2 && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Properti ke-2</span>
            </button>
          )}
          {properties.length > 0 && (
            <button
              type="button"
              onClick={onClearCompare}
              className="flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </section>

      {/* Notice when only 1 property selected */}
      {properties.length < 2 && (
        <div className="bg-blue-50/90 border border-blue-200 p-4 rounded-3xl text-xs text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span>
              Pilih <strong>1 properti lagi</strong> dari katalog untuk melihat perbandingan matriks 2 properti secara berdampingan.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all active:scale-95 shrink-0 shadow-xs"
          >
            + Pilih Properti Kedua
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2-COLUMN SIDE-BY-SIDE PROPERTY COMPARISON (Desktop & Mobile Unified)      */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Top Cards: Side-by-Side (50% / 50%) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {/* Card 1 */}
          {propA && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <button
                type="button"
                onClick={() => onRemoveFromCompare(propA.id)}
                className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors shadow-xs"
                title="Hapus dari perbandingan"
                aria-label="Hapus properti 1"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <div className="space-y-3">
                <div className="h-32 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={propA.images[0]?.url}
                    alt={propA.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs font-black uppercase shadow-xs">
                    Properti 1
                  </span>
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider block truncate">
                    {propA.propertyTypeName}
                  </span>
                  <h2
                    onClick={() => onNavigate(`/property/${propA.slug}`)}
                    className="text-xs sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {propA.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                    {propA.location.city}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate(`/property/${propA.slug}`)}
                  className="flex-1 py-2 px-3 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span>Buka Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(`/simulator/kpr?price=${propA.price}`)}
                  className="hidden sm:flex py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95 items-center justify-center gap-1"
                >
                  <Calculator className="w-3.5 h-3.5 text-blue-600" />
                  <span>KPR</span>
                </button>
              </div>
            </div>
          )}

          {/* Card 2 */}
          {propB ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <button
                type="button"
                onClick={() => onRemoveFromCompare(propB.id)}
                className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors shadow-xs"
                title="Hapus dari perbandingan"
                aria-label="Hapus properti 2"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <div className="space-y-3">
                <div className="h-32 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={propB.images[0]?.url}
                    alt={propB.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] sm:text-xs font-black uppercase shadow-xs">
                    Properti 2
                  </span>
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider block truncate">
                    {propB.propertyTypeName}
                  </span>
                  <h2
                    onClick={() => onNavigate(`/property/${propB.slug}`)}
                    className="text-xs sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    {propB.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                    {propB.location.city}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate(`/property/${propB.slug}`)}
                  className="flex-1 py-2 px-3 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span>Buka Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(`/simulator/kpr?price=${propB.price}`)}
                  className="hidden sm:flex py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95 items-center justify-center gap-1"
                >
                  <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                  <span>KPR</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Slot Properti 2 Kosong</p>
                <p className="text-xs text-slate-500 mt-0.5">Pilih properti kedua untuk komparasi</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs active:scale-95 hover:bg-blue-600 transition-all"
              >
                + Pilih Properti
              </button>
            </div>
          )}
        </div>

        {/* Synchronized Metrics Comparison Grid */}
        {propA && (
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs divide-y divide-slate-100">
            {getAttributes(propA).map((attrA, idx) => {
              const attrB = propB ? getAttributes(propB)[idx] : null;
              const Icon = attrA.icon;

              return (
                <div key={idx} className="p-3.5 sm:p-5 space-y-2.5">
                  {/* Parameter Label Header */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-800">
                    <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{attrA.label}</span>
                  </div>

                  {/* Dual Column Comparative Values */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4 text-xs sm:text-sm">
                    {/* Column 1 (Properti A) */}
                    <div
                      className={`p-3 sm:p-4 rounded-2xl ${
                        attrA.isHighlight
                          ? 'bg-blue-50/80 text-blue-950 font-black border border-blue-100'
                          : 'bg-slate-50 text-slate-800 font-semibold'
                      }`}
                    >
                      <span className="text-[10px] text-blue-600 block font-bold mb-0.5 uppercase tracking-wider">
                        Properti 1
                      </span>
                      <div className="text-xs sm:text-base font-extrabold">{attrA.value}</div>
                      {attrA.subtext && (
                        <div className="text-[10px] text-slate-500 font-normal mt-1 leading-tight">
                          {attrA.subtext}
                        </div>
                      )}
                    </div>

                    {/* Column 2 (Properti B) */}
                    {attrB ? (
                      <div
                        className={`p-3 sm:p-4 rounded-2xl ${
                          attrB.isHighlight
                            ? 'bg-indigo-50/80 text-indigo-950 font-black border border-indigo-100'
                            : 'bg-slate-50 text-slate-800 font-semibold'
                        }`}
                      >
                        <span className="text-[10px] text-indigo-600 block font-bold mb-0.5 uppercase tracking-wider">
                          Properti 2
                        </span>
                        <div className="text-xs sm:text-base font-extrabold">{attrB.value}</div>
                        {attrB.subtext && (
                          <div className="text-[10px] text-slate-500 font-normal mt-1 leading-tight">
                            {attrB.subtext}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 text-slate-400 italic text-xs flex items-center justify-center border border-dashed border-slate-200">
                        Belum ada properti ke-2
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Property Slot Modal (Strictly 2 properties max) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Pilih Properti Kedua untuk Komparasi"
        maxWidth="2xl"
      >
        <div className="space-y-3">
          {availableToAdd.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              Tidak ada properti lain yang tersedia dalam katalog.
            </p>
          ) : (
            availableToAdd.map((prop) => (
              <div
                key={prop.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prop.images[0]?.url}
                    alt={prop.title}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{prop.title}</h4>
                    <p className="text-xs text-slate-500">
                      {prop.location.city} • {formatRupiah(prop.price)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onAddToCompare(prop.id);
                    setIsAddModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pilih</span>
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>
    </main>
  );
};
