import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  template: `
    <nav aria-label="Breadcrumb" class="py-3">
      <ol class="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
        <li class="flex items-center">
          <button (click)="navigate('/')" class="flex items-center gap-1 hover:text-slate-900 transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span>Beranda</span>
          </button>
        </li>
        @for (item of items; track $index; let last = $last) {
          <li class="flex items-center gap-1.5">
            <svg class="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            @if (last || !item.path) {
              <span class="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-[320px]">{{ item.label }}</span>
            } @else {
              <button (click)="navigate(item.path!)" class="hover:text-slate-900 transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 truncate max-w-[150px]">{{ item.label }}</button>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class BreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];
  private router = inject(Router);

  navigate(path: string): void {
    const [pathname, search] = path.split('?');
    if (search) {
      const params: Record<string, string> = {};
      new URLSearchParams(search).forEach((v, k) => params[k] = v);
      this.router.navigate([pathname], { queryParams: params });
    } else {
      this.router.navigate([pathname]);
    }
  }
}
