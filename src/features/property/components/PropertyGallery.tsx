import React, { useState } from 'react';
import { PropertyImage, ImageCategory } from '../../../core/types/property.types';
import { Maximize2, X, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | 'ALL'>('ALL');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const categories = Array.from(new Set(images.map((img) => img.category)));
  const filteredImages =
    selectedCategory === 'ALL'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const currentImage = filteredImages[activeImageIndex] || filteredImages[0] || images[0];

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <section aria-labelledby="gallery-heading" className="space-y-4">
      <h2 id="gallery-heading" className="sr-only">
        Galeri Foto Properti
      </h2>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL');
              setActiveImageIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua Foto ({images.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setActiveImageIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat} ({images.filter((i) => i.category === cat).length})
            </button>
          ))}
        </div>
      )}

      {/* Primary Big Display */}
      <div className="relative h-[340px] sm:h-[460px] w-full rounded-2xl overflow-hidden bg-slate-950 group shadow-md">
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className="w-full h-full object-cover transition-opacity duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Top/Bottom Overlay Controls */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
            {currentImage.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsViewerOpen(true)}
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md backdrop-blur-xs transition-transform active:scale-95"
          aria-label="Buka foto layar penuh"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Layar Penuh</span>
        </button>

        {/* Carousel Prev/Next Buttons */}
        {filteredImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
              aria-label="Foto selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs z-10 drop-shadow-md">
          <p className="font-medium bg-black/40 px-3 py-1 rounded-lg backdrop-blur-xs max-w-[80%] truncate">
            {currentImage.alt}
          </p>
          <span className="bg-black/60 px-2.5 py-1 rounded-lg font-bold">
            {activeImageIndex + 1} / {filteredImages.length}
          </span>
        </div>
      </div>

      {/* Thumbnails Row */}
      {filteredImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
          {filteredImages.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative h-18 sm:h-22 rounded-xl overflow-hidden border-2 transition-all ${
                activeImageIndex === idx
                  ? 'border-blue-600 ring-2 ring-blue-600/30'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal Lightbox */}
      {isViewerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
        >
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold truncate max-w-md">{title}</h3>
              <p className="text-xs text-slate-400">
                {currentImage.alt} • Kategori: {currentImage.category}
              </p>
            </div>
            <button
              onClick={() => setIsViewerOpen(false)}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Tutup penampil foto"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />

            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors"
                  aria-label="Foto selanjutnya"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {filteredImages.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  activeImageIndex === idx ? 'border-blue-500 scale-105' : 'border-transparent opacity-40 hover:opacity-80'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
