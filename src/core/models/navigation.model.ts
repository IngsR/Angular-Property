import { LucideIcon } from 'lucide-react';

export interface NavRoute {
  path: string;
  title: string;
  label: string;
  icon?: LucideIcon;
  exact?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
