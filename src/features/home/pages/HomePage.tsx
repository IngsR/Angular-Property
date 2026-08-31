import React, { useEffect, useState } from 'react';
import { Property, PropertyType } from '../../../core/types/property.types';
import { propertyRepository } from '../../../core/repositories/property.repository';
import { PropertyCard } from '../../discovery/components/PropertyCard';
import { Button } from '../../../shared/ui/Button';
import {
  Search,
  Building2,
  Compass,
  Scale,
  Calculator,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  comparisonList: string[];
  onToggleCompare: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  favorites,
  onToggleFavorite,
  comparisonList,
  onToggleCompare,
}) => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [searchCity, setSearchCity] = useState('ALL');
  const [searchType, setSearchType] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    async function loadData() {
      const [featured, cityList, types] = await Promise.all([
        propertyRepository.getFeaturedProperties(6),
        propertyRepository.getCities(),
        propertyRepository.getPropertyTypes(),
      ]);
      setFeaturedProperties(featured);
      setCities(cityList);
      setPropertyTypes(types);
    }
    loadData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.set('search', searchKeyword.trim());
    if (searchCity !== 'ALL') params.set('city', searchCity);
    if (searchType !== 'ALL') params.set('propertyType', searchType);
    onNavigate(`/buy?${params.toString()}`);
  };

  return (
    <main className="space-y-16 pb-16">
      {/* 1. Hero Section (Full-bleed to top browser edge) */}
      <section className="relative bg-slate-900 text-white overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 -mt-0">
        {/* Background Ambient Lights */}
        <div className="absolute -top-10 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/25 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Platform Keputusan Properti #1 di Indonesia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
            Temukan Rumah Impian. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300">
              Evaluasi Spesifikasi. Putuskan Finansial.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Platform komparasi objektif, denah arsitektur riil, dan simulasi KPR akurat dari pengembang terverifikasi di Padang, Jakarta, Bandung, dan Bali.
          </p>

          {/* Hero Search Box Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-900 max-w-4xl mx-auto mt-8 border border-slate-100">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Keyword */}
              <div className="sm:col-span-1 text-left">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Kata Kunci
                </label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Kuranji, BSD, Dago..."
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Kota */}
              <div className="text-left">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Pilih Kota
                </label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer"
                >
                  <option value="ALL">Semua Kota</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipe Properti */}
              <div className="text-left">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Tipe Properti
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer"
                >
                  <option value="ALL">Semua Tipe</option>
                  {propertyTypes.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  className="w-full font-bold shadow-md"
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  Cari Properti
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Smart Home Buying Guide & Tips Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Panduan Pembeli Cerdas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tips & Panduan Lengkap Pembelian Rumah
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Langkah krusial dan panduan praktis agar investasi hunian pertama Anda aman secara hukum, sehat secara finansial, dan nyaman dihuni jangka panjang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tip 1: Legalitas */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  Langkah 1 · Legalitas
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Cek Keaslian Sertifikat & Izin Bangunan (PBG)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pastikan status tanah berstatus <strong>Sertifikat Hak Milik (SHM)</strong> atau HGB murni, serta memiliki Persetujuan Bangunan Gedung (PBG/IMB) resmi dan bebas dari sengketa perbankan.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-blue-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Verifikasi BPN & Notaris</span>
            </div>
          </div>

          {/* Tip 2: Rasio Finansial KPR */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Calculator className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Langkah 2 · Finansial
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Terapkan Rasio Cicilan Maksimal 30% Gaji
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Idealnya total angsuran KPR tidak melebihi <strong>30% - 35%</strong> dari penghasilan gabungan bulanan. Siapkan juga dana darurat 3-6 bulan dan biaya akad jual beli (BPHTB & Notaris).
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gunakan Simulasi KPR All-in</span>
            </div>
          </div>

          {/* Tip 3: Evaluasi Denah & Tata Ruang */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Langkah 3 · Arsitektur
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Analisis Denah, Pencahayaan & Ventilasi Alami
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Periksa tata letak ruang per lantai, arah bukaan jendela terhadap matahari, sirkulasi silang (*cross-ventilation*), serta opsi pengembangan struktur bangunan di masa depan.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-indigo-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cek Blueprint & Ketinggian Plafon</span>
            </div>
          </div>

          {/* Tip 4: Survei Lingkungan & Komparasi */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-purple-400 hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                  Langkah 4 · Lapangan
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Survei Fisik Lingkungan & Bandingkan Opsi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lakukan survei saat musim hujan untuk memastikan kawasan bebas banjir, uji kualitas air tanah, periksa aksesibilitas jalan utama, dan komparasikan 2-4 unit pilihan secara objektif.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-purple-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Manfaatkan Fitur Komparasi</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Properti Pilihan Unggulan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Unit terverifikasi dengan legalitas lengkap dan siap huni
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => onNavigate('/buy')}
          >
            Lihat Semua Katalog
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onNavigate={onNavigate}
              isFavorite={favorites.includes(prop.id)}
              onToggleFavorite={onToggleFavorite}
              isCompared={comparisonList.includes(prop.id)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      </section>

      {/* 4. Interactive KPR Simulator Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              Kalkulator Mandiri
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ketahui Kemampuan Cicilan KPR Sebelum Membeli
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Gunakan simulasi anuitas interaktif dengan rekomendasi rasio cicilan terhadap penghasilan keluarga Anda secara instan.
            </p>
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="font-bold shrink-0 shadow-lg px-8"
            leftIcon={<Calculator className="w-5 h-5" />}
            onClick={() => onNavigate('/simulator/kpr')}
          >
            Buka Simulator KPR
          </Button>
        </div>
      </section>

      {/* 5. Verified Developer Partners Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Kemitraan Terpercaya
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Pengembang & Developer Properti Resmi
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              name: 'PT Ranah Minang Propertindo',
              desc: 'Spesialis Hunian Anti-Gempa Sumatera Barat',
              logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=160&q=80',
            },
            {
              name: 'Sinarmas Land Developer',
              desc: 'Kota Mandiri BSD City & Urban Living',
              logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=160&q=80',
            },
            {
              name: 'Ciputra Group Heritage',
              desc: 'EcoCulture & Prestisius Lifestyle',
              logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=160&q=80',
            },
            {
              name: 'Bali Sanctuary Living',
              desc: 'Luxury Resort & High Yield Villas',
              logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=160&q=80',
            },
          ].map((dev, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-2 hover:border-slate-300 transition-colors"
            >
              <img
                src={dev.logo}
                alt={dev.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <p className="text-xs font-bold text-slate-900 leading-tight">{dev.name}</p>
              <p className="text-[11px] text-slate-500 line-clamp-2">{dev.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
