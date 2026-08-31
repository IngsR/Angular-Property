export interface NavRoute {
  path: string;
  title: string;
  label: string;
  icon?: string;
  exact?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
