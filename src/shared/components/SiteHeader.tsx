import React from 'react';
import { Home, Compass, Bookmark, Scale, Calculator, Building2 } from 'lucide-react';

interface SiteHeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  favoritesCount: number;
  comparisonCount: number;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentPath,
  onNavigate,
  favoritesCount,
  comparisonCount,
}) => {
  const isHomePage = currentPath === '/';

  const navItems = [
    { label: 'Beranda', path: '/', icon: Home },
    { label: 'Jelajah', path: '/buy', icon: Compass },
    {
      label: 'Bandingkan',
      path: '/compare',
      icon: Scale,
      badge: comparisonCount > 0 ? comparisonCount : null,
    },
    {
      label: 'Favorit',
      path: '/favorites',
      icon: Bookmark,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    { label: 'Simulator KPR', path: '/simulator/kpr', icon: Calculator },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
  };

  return (
    <header
      className={`w-full z-40 transition-all ${
        isHomePage
          ? 'absolute top-0 left-0 right-0 bg-transparent'
          : 'sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Logo Capsule */}
          <div
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleLinkClick('/');
            }}
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-xs shrink-0 ${
                isHomePage
                  ? 'bg-white/10 text-white backdrop-blur-md border border-white/20 group-hover:bg-blue-600'
                  : 'bg-slate-900 text-white group-hover:bg-blue-600'
              }`}
            >
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-sm sm:text-lg font-black tracking-tight ${
                  isHomePage ? 'text-white' : 'text-slate-900'
                }`}
              >
                PropertiDecide
              </span>
              <span
                className={`hidden sm:inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  isHomePage
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                    : 'bg-blue-50 text-blue-700 border-blue-200/80'
                }`}
              >
                Platform
              </span>
            </div>
          </div>

          {/* Desktop Capsule Navigation (Pill with Labels & Icons) */}
          <nav
            className={`hidden md:flex items-center gap-1.5 p-1.5 rounded-full backdrop-blur-xl border shadow-lg transition-all ${
              isHomePage
                ? 'bg-slate-900/60 border-white/15 shadow-slate-950/20 text-white'
                : 'bg-white/90 border-slate-200/90 shadow-slate-900/5 text-slate-700'
            }`}
            aria-label="Desktop Main Navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path !== '/' && currentPath.startsWith(item.path));

              return (
                <button
                  key={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                    isActive
                      ? isHomePage
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-900 text-white shadow-xs'
                      : isHomePage
                      ? 'text-slate-200 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? isHomePage
                          ? 'text-white'
                          : 'text-blue-300'
                        : isHomePage
                        ? 'text-slate-300'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`inline-flex items-center justify-center px-1.5 py-0.2 text-[9px] font-black rounded-full ${
                        isActive
                          ? 'bg-white text-blue-700'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Top Navbar (Sejajar dengan Logo di atas layar, rapi dan elegan tanpa tombol yang memaksa) */}
          <nav
            className={`flex md:hidden items-center gap-1 p-1 rounded-full border backdrop-blur-xl transition-all shadow-xs ${
              isHomePage
                ? 'bg-slate-900/60 border-white/15 text-white'
                : 'bg-slate-100/90 border-slate-200/90 text-slate-700'
            }`}
            aria-label="Mobile Navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path !== '/' && currentPath.startsWith(item.path));

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleLinkClick(item.path)}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-90 ${
                    isActive
                      ? isHomePage
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-900 text-white shadow-xs'
                      : isHomePage
                      ? 'text-slate-300 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                  title={item.label}
                  aria-label={item.label}
                >
                  <Icon className="w-4 h-4" />
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center border border-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action Button (Only on md+ screens) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLinkClick('/buy')}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md active:scale-95 ${
                isHomePage
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Cari Properti</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
