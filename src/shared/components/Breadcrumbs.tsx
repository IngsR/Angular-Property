import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
        <li className="flex items-center">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1 hover:text-slate-900 transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              {isLast || !item.path ? (
                <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-[320px]">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(item.path!)}
                  className="hover:text-slate-900 transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 truncate max-w-[150px]"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
