import React from 'react';
import { Property } from '../../../core/types/property.types';
import { Badge } from '../../../shared/ui/Badge';
import { MapPin, ShieldCheck, Building, CheckCircle2 } from 'lucide-react';

interface PropertyHeaderProps {
  property: Property;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  return (
    <header className="space-y-3 pb-6 border-b border-slate-200">
      {/* Category, Partner, Status Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="primary" size="md">
          {property.propertyTypeName}
        </Badge>

        <Badge
          variant={
            property.availability === 'AVAILABLE'
              ? 'success'
              : property.availability === 'LIMITED'
              ? 'warning'
              : 'danger'
          }
          size="md"
        >
          {property.availability === 'AVAILABLE'
            ? 'Tersedia Siap Huni'
            : property.availability === 'LIMITED'
            ? 'Unit Terbatas'
            : 'Terjual'}
        </Badge>

        {property.partner?.verified && (
          <Badge variant="verified" size="md">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-indigo-600" />
            Developer Terverifikasi
          </Badge>
        )}

        {property.specification.certificate && (
          <Badge variant="outline" size="md">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            {property.specification.certificate}
          </Badge>
        )}
      </div>

      {/* Project info if part of project */}
      {property.project && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50/80 px-3 py-1 rounded-lg w-fit">
          <Building className="w-3.5 h-3.5" />
          <span>Bagian dari Project: {property.project.name}</span>
        </div>
      )}

      {/* Title & Tagline */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {property.title}
      </h1>

      {property.tagline && (
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
          {property.tagline}
        </p>
      )}

      {/* Location Address */}
      <div className="flex items-center gap-2 text-sm text-slate-600 pt-1">
        <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          {property.location.address}, {property.location.district ? `${property.location.district}, ` : ''}
          {property.location.city}, {property.location.province}
        </span>
      </div>
    </header>
  );
};
