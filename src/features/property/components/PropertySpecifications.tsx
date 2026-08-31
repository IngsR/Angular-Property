import React from 'react';
import { PropertySpecification } from '../../../core/types/property.types';
import {
  Bed,
  Bath,
  Home,
  Maximize,
  Layers,
  Car,
  FileCheck,
  Zap,
  Compass,
  Armchair,
} from 'lucide-react';

interface PropertySpecificationsProps {
  specification: PropertySpecification;
}

export const PropertySpecifications: React.FC<PropertySpecificationsProps> = ({
  specification,
}) => {
  const specs = [
    {
      label: 'Kamar Tidur',
      value: `${specification.bedrooms} Kamar`,
      icon: Bed,
    },
    {
      label: 'Kamar Mandi',
      value: `${specification.bathrooms} Kamar Mandi`,
      icon: Bath,
    },
    {
      label: 'Luas Bangunan',
      value: `${specification.buildingArea} m²`,
      icon: Home,
    },
    {
      label: 'Luas Tanah',
      value: `${specification.landArea} m²`,
      icon: Maximize,
    },
    {
      label: 'Jumlah Lantai',
      value: `${specification.floors} Lantai`,
      icon: Layers,
    },
    {
      label: 'Kapasitas Parkir / Carport',
      value: `${specification.parking} Mobil`,
      icon: Car,
    },
    {
      label: 'Legalitas / Sertifikat',
      value: specification.certificate || 'SHM Murni',
      icon: FileCheck,
    },
    {
      label: 'Daya Listrik',
      value: specification.electricity || '2200 VA',
      icon: Zap,
    },
    {
      label: 'Kondisi Perabotan',
      value:
        specification.furnishing === 'FULL_FURNISHED'
          ? 'Full Furnished'
          : specification.furnishing === 'SEMI_FURNISHED'
          ? 'Semi Furnished'
          : 'Unfurnished',
      icon: Armchair,
    },
    {
      label: 'Arah Hadap Bangunan',
      value:
        specification.facing === 'NORTH'
          ? 'Utara'
          : specification.facing === 'SOUTH'
          ? 'Selatan'
          : specification.facing === 'EAST'
          ? 'Timur'
          : 'Barat',
      icon: Compass,
    },
  ];

  return (
    <section aria-labelledby="specifications-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="specifications-heading" className="text-xl font-bold text-slate-900">
          Spesifikasi Properti
        </h2>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <Icon className="w-4 h-4 text-blue-600" />
                <dt className="text-[11px] font-medium text-slate-500 truncate">
                  {item.label}
                </dt>
              </div>
              <dd className="text-sm font-bold text-slate-900 truncate">
                {item.value}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
};
