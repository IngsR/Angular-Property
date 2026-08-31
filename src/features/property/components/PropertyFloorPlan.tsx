import React, { useState } from 'react';
import { FloorPlan, FloorPlanRoom } from '../../../core/types/property.types';
import {
  Layers,
  Bed,
  Bath,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Compass,
  Utensils,
  Tv,
  Car,
  Trees,
  CheckCircle2,
  Info,
  X,
  Sparkles,
} from 'lucide-react';

interface PropertyFloorPlanProps {
  floorPlans: FloorPlan[];
}

export const PropertyFloorPlan: React.FC<PropertyFloorPlanProps> = ({ floorPlans }) => {
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<FloorPlanRoom | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'dimensions'>('visual');

  if (!floorPlans || floorPlans.length === 0) {
    return (
      <section aria-labelledby="floor-plan-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="floor-plan-heading" className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <span>Denah & Tata Ruang Arsitektur</span>
          </h2>
        </div>
        <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center text-slate-500 text-sm">
          Denah arsitektur detail sedang disiapkan oleh developer. Hubungi agen untuk blueprint CAD resmi.
        </div>
      </section>
    );
  }

  const currentPlan = floorPlans[activeFloorIndex] || floorPlans[0];
  const rooms = currentPlan.rooms || [];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const getRoomIcon = (type?: string) => {
    switch (type) {
      case 'bedroom':
        return <Bed className="w-4 h-4 text-indigo-600" />;
      case 'living':
        return <Tv className="w-4 h-4 text-blue-600" />;
      case 'kitchen':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'bathroom':
        return <Bath className="w-4 h-4 text-cyan-600" />;
      case 'carport':
        return <Car className="w-4 h-4 text-emerald-600" />;
      case 'garden':
        return <Trees className="w-4 h-4 text-green-600" />;
      default:
        return <Maximize2 className="w-4 h-4 text-slate-600" />;
    }
  };

  const getRoomBadgeColor = (type?: string) => {
    switch (type) {
      case 'bedroom':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'living':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'kitchen':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'bathroom':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'carport':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'garden':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section aria-labelledby="floor-plan-heading" className="space-y-4">
      {/* Section Header with Floor Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 id="floor-plan-heading" className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <span>Denah & Tata Ruang Arsitektur</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Eksplorasi blueprint 2D terukur, tata letak ruang, dan dimensi presisi setiap ruangan
          </p>
        </div>

        {/* Multi-floor Level Switcher */}
        {floorPlans.length > 1 && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full w-fit shrink-0">
            {floorPlans.map((plan, idx) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  setActiveFloorIndex(idx);
                  setZoomLevel(1);
                  setSelectedRoom(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                  activeFloorIndex === idx
                    ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Lantai {plan.floor}</span>
                <span className="text-[10px] font-normal opacity-80">({plan.area} m²)</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Floor Plan Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Floor Plan Sub-header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                {currentPlan.name}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Lantai {currentPlan.floor}
              </span>
            </div>
            {currentPlan.note && (
              <p className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>{currentPlan.note}</span>
              </p>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 shrink-0">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Luas: {currentPlan.area} m²</span>
            </div>
            {currentPlan.bedrooms && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
                <Bed className="w-3.5 h-3.5 text-indigo-600" />
                <span>{currentPlan.bedrooms} Kamar</span>
              </div>
            )}
            {currentPlan.bathrooms && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
                <Bath className="w-3.5 h-3.5 text-cyan-600" />
                <span>{currentPlan.bathrooms} KM</span>
              </div>
            )}
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="px-4 sm:px-5 pt-3 flex items-center justify-between gap-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'visual'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Visual Denah Arsitektur
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dimensions')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1 ${
                activeTab === 'dimensions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Rincian Dimensi Ruangan</span>
              {rooms.length > 0 && (
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {rooms.length}
                </span>
              )}
            </button>
          </div>

          {/* Interactive Toolbar for Visual Tab */}
          {activeTab === 'visual' && (
            <div className="flex items-center gap-1 pb-2">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-2xs active:scale-95"
                title="Perbesar Denah (+)"
                aria-label="Perbesar denah"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-2xs active:scale-95"
                title="Perkecil Denah (-)"
                aria-label="Perkecil denah"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-2xs active:scale-95"
                title="Reset Zoom"
                aria-label="Reset zoom denah"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="p-2 rounded-full bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-2xs ml-1 active:scale-95"
                title="Buka Layar Penuh"
                aria-label="Buka denah layar penuh"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Visual Blueprint Canvas */}
        {activeTab === 'visual' && (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Visual Canvas */}
            <div className="relative h-[320px] sm:h-[420px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center select-none group">
              {/* Blueprint Grid Lines Pattern in background */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Architectural North Arrow & Compass Badge */}
              <div className="absolute top-3 right-3 z-10 flex flex-col items-center bg-slate-900/90 text-white px-2.5 py-2 rounded-lg border border-slate-700/80 shadow-md backdrop-blur-xs">
                <div className="text-[9px] font-black text-amber-400">UTARA</div>
                <div className="w-0.5 h-4 bg-gradient-to-t from-transparent via-amber-400 to-amber-400 mt-0.5" />
                <div className="w-2 h-2 border-t-2 border-r-2 border-amber-400 rotate-[-45deg] -mt-1" />
              </div>

              {/* Interactive Floor Plan Image */}
              <div
                className="w-full h-full flex items-center justify-center p-4 transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={currentPlan.url}
                  alt={currentPlan.name}
                  className="max-w-full max-h-full object-contain filter drop-shadow-2xl"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Zoom percentage indicator */}
              <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-bold border border-slate-700/60 backdrop-blur-xs">
                Zoom: {Math.round(zoomLevel * 100)}%
              </div>

              {/* Fullscreen Trigger Overlay Button on hover */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
              >
                <Maximize className="w-3.5 h-3.5" />
                <span>Perbesar HD</span>
              </button>
            </div>

            {/* Quick Room Dimensions Chips for Visual View */}
            {rooms.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Tata Ruang & Dimensi Presisi ({rooms.length} Ruangan):</span>
                  <span className="text-blue-600 cursor-pointer" onClick={() => setActiveTab('dimensions')}>
                    Lihat Tabel Lengkap →
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {rooms.map((room, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                        selectedRoom?.name === room.name
                          ? 'border-blue-500 bg-blue-50/80 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {getRoomIcon(room.type)}
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {room.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                        <span className="text-slate-500">{room.dimension}</span>
                        <span className="text-blue-700 font-bold">{room.area} m²</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Full Room Dimension Specification Table */}
        {activeTab === 'dimensions' && (
          <div className="p-4 sm:p-5 space-y-4">
            {rooms.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <th className="pb-3 pl-2">Ruangan</th>
                      <th className="pb-3 px-3">Kategori</th>
                      <th className="pb-3 px-3">Dimensi (P × L)</th>
                      <th className="pb-3 px-3 text-right">Luas Bersih</th>
                      <th className="pb-3 pr-2 text-right">Porsi Lantai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {rooms.map((room, idx) => {
                      const percentage = currentPlan.area
                        ? Math.round((room.area / currentPlan.area) * 100)
                        : 0;

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/80 transition-colors font-medium"
                        >
                          <td className="py-3 pl-2 font-bold text-slate-900 flex items-center gap-2">
                            {getRoomIcon(room.type)}
                            <span>{room.name}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getRoomBadgeColor(
                                room.type
                              )}`}
                            >
                              {room.type
                                ? room.type.charAt(0).toUpperCase() + room.type.slice(1)
                                : 'Ruang'}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">
                            {room.dimension}
                          </td>
                          <td className="py-3 px-3 text-right font-black text-slate-900">
                            {room.area} m²
                          </td>
                          <td className="py-3 pr-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className="h-full bg-blue-600 rounded-full"
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-slate-500">
                                {percentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 font-extrabold text-slate-900 bg-slate-50/50">
                      <td colSpan={3} className="py-3 pl-2 text-slate-800">
                        Total Luas Efektif Lantai {currentPlan.floor}
                      </td>
                      <td className="py-3 px-3 text-right text-blue-700 text-sm">
                        {currentPlan.area} m²
                      </td>
                      <td className="py-3 pr-2 text-right text-slate-600">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-xs py-4 text-center">
                Data dimensi detail sedang dikalkulasi oleh tim arsitek.
              </p>
            )}

            {/* Architectural Highlights Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Cross Ventilation</div>
                  <div className="text-slate-500 text-[11px]">Sirkulasi udara silang aktif di ruang utama</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Ceiling Tinggi (3.2m - 3.8m)</div>
                  <div className="text-slate-500 text-[11px]">Ruang lebih sejuk dan kesan lapang</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Fondasi Rumah Tumbuh</div>
                  <div className="text-slate-500 text-[11px]">Dapat dikembangkan vertikal di masa depan</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen HD Modal Lightbox */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-white">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-base sm:text-lg">{currentPlan.name}</h3>
              <span className="text-xs px-2.5 py-1 rounded bg-blue-600 font-bold">
                Lantai {currentPlan.floor} ({currentPlan.area} m²)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                title="Perbesar"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                title="Perkecil"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white ml-2"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <img
              src={currentPlan.url}
              alt={currentPlan.name}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-w-full max-h-[85vh] object-contain transition-transform duration-200 drop-shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
