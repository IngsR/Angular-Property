import React from 'react';
import { Location } from '../../../core/types/property.types';
import { MapPin, Navigation, School, Hospital, ShoppingBag, Train } from 'lucide-react';

interface PropertyLocationProps {
  location: Location;
}

const landmarkIcons: Record<string, React.ElementType> = {
  TRANSIT: Train,
  EDUCATION: School,
  HOSPITAL: Hospital,
  SHOPPING: ShoppingBag,
};

export const PropertyLocation: React.FC<PropertyLocationProps> = ({ location }) => {
  return (
    <section aria-labelledby="location-heading" className="space-y-4">
      <h2 id="location-heading" className="text-xl font-bold text-slate-900">
        Lokasi & Aksesibilitas Sekitar
      </h2>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              {location.address}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {location.district ? `${location.district}, ` : ''}{location.city}, {location.province}
              {location.postalCode ? ` (${location.postalCode})` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>Koordinat: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
          </div>
        </div>

        {/* Map Placeholder with realistic styling */}
        <div className="relative h-64 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center p-6">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-blue-400/30 animate-pulse">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-sm">Peta Interaktif Kawasan {location.city}</h4>
            <p className="text-xs text-slate-300 max-w-sm">
              Lokasi strategis berada di titik koordinat ({location.latitude}, {location.longitude})
            </p>
          </div>
        </div>

        {/* Nearby Facilities */}
        {location.nearbyPlaces && location.nearbyPlaces.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Fasilitas & Tempat Penting Terdekat:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {location.nearbyPlaces.map((place, idx) => {
                const Icon = landmarkIcons[place.category] || MapPin;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">{place.name}</p>
                      <p className="text-[11px] text-blue-600 font-semibold">{place.distance}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
