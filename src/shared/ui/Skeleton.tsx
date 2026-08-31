import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200/90 rounded-md ${className}`} />;
};

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <div className="pt-2 border-t border-slate-100 grid grid-cols-4 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="pt-2 flex justify-between items-center">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
