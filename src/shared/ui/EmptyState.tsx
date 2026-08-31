import React from 'react';
import { SearchX, FolderOpen, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'search' | 'folder' | 'custom';
  customIcon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = 'search',
  customIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-dashed border-slate-300 max-w-xl mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 shadow-xs">
        {customIcon ? (
          customIcon
        ) : icon === 'search' ? (
          <SearchX className="w-7 h-7" />
        ) : (
          <FolderOpen className="w-7 h-7" />
        )}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="outline" size="md" onClick={onAction} leftIcon={<RefreshCcw className="w-4 h-4" />}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
