import React from 'react';
import { Facility } from '../../../core/types/property.types';
import {
  ShieldCheck,
  KeyRound,
  Waves,
  Dumbbell,
  Cpu,
  Zap,
  Trees,
  Smile,
  Car,
  Wifi,
  CheckCircle2,
} from 'lucide-react';

interface PropertyFacilitiesProps {
  facilities: Facility[];
}

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  KeyRound,
  Waves,
  Dumbbell,
  Cpu,
  Zap,
  Trees,
  Smile,
  Car,
  Wifi,
};

export const PropertyFacilities: React.FC<PropertyFacilitiesProps> = ({ facilities }) => {
  if (!facilities || facilities.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="facilities-heading" className="space-y-4">
      <h2 id="facilities-heading" className="text-xl font-bold text-slate-900">
        Fasilitas & Fitur Lingkungan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {facilities.map((fac) => {
          const Icon = iconMap[fac.icon] || CheckCircle2;
          return (
            <div
              key={fac.id}
              className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{fac.name}</p>
                {fac.category && (
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {fac.category}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
