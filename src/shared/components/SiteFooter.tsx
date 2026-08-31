import React from 'react';
import { Building2, ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';

interface SiteFooterProps {
  onNavigate: (path: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                PropertiDecide
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Platform discovery, evaluasi spesifikasi mendalam, dan simulasi finansial keputusan kepemilikan properti di Indonesia secara transparan, akurat, dan terverifikasi.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3.5 py-2 rounded-full border border-slate-700/60 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Listing Resmi Developer Terverifikasi & Bebas Sengketa</span>
            </div>
          </div>

          {/* Col 3: Discovery */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Discovery
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/buy')}
                  className="hover:text-white transition-colors"
                >
                  Semua Properti Dijual
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/buy?propertyType=type-rumah')}
                  className="hover:text-white transition-colors"
                >
                  Rumah Tapak (Landed House)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/buy?propertyType=type-apartemen')}
                  className="hover:text-white transition-colors"
                >
                  Apartemen & Kondominium
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/buy?propertyType=type-villa')}
                  className="hover:text-white transition-colors"
                >
                  Villa & Resort Residences
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/buy?city=Padang')}
                  className="hover:text-white transition-colors"
                >
                  Properti di Kota Padang
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Decision Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Decision Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/simulator/kpr')}
                  className="hover:text-white transition-colors"
                >
                  Simulator Angsuran KPR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/compare')}
                  className="hover:text-white transition-colors"
                >
                  Komparasi Properti
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/favorites')}
                  className="hover:text-white transition-colors"
                >
                  Properti Tersimpan
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Hubungi Konsultan */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Layanan Informasi
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Padang, Jakarta, Bandung & Denpasar</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+62 811-9876-5432</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>inquiry@propertidecide.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PropertiDecide Platform. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Standardized Domain Architecture
            </span>
            <span>•</span>
            <span>Production Grade Frontend</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
