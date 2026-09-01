import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComparisonService {
  private readonly STORAGE_KEY = 'properidecide_comparison';
  readonly MAX_COMPARISON_ITEMS = 2;

  private _comparisonList = signal<string[]>(this.loadInitialState());
  readonly comparisonList = this._comparisonList.asReadonly();

  private loadInitialState(): string[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.slice(0, this.MAX_COMPARISON_ITEMS) : [];
      }
      return [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._comparisonList()));
    } catch (e) {
      console.warn('Failed to persist comparison list', e);
    }
  }

  getComparisonList(): string[] {
    return this._comparisonList();
  }

  isInComparison(id: string): boolean {
    return this._comparisonList().includes(id);
  }

  add(id: string): { success: boolean; message?: string } {
    if (this._comparisonList().includes(id)) {
      return { success: false, message: 'Properti sudah ada di perbandingan' };
    }
    if (this._comparisonList().length >= this.MAX_COMPARISON_ITEMS) {
      return { success: false, message: `Maksimal ${this.MAX_COMPARISON_ITEMS} properti untuk dibandingkan` };
    }
    this._comparisonList.update(list => [...list, id]);
    this.persist();
    return { success: true, message: 'Properti ditambahkan ke perbandingan' };
  }

  remove(id: string): boolean {
    if (this._comparisonList().includes(id)) {
      this._comparisonList.update(list => list.filter(item => item !== id));
      this.persist();
      return true;
    }
    return false;
  }

  toggle(id: string): { isInComparison: boolean; message: string } {
    if (this.isInComparison(id)) {
      this.remove(id);
      return { isInComparison: false, message: 'Properti dikeluarkan dari perbandingan' };
    } else {
      const result = this.add(id);
      if (result.success) {
        return { isInComparison: true, message: 'Properti ditambahkan ke perbandingan' };
      } else {
        return { isInComparison: false, message: result.message || 'Gagal menambahkan' };
      }
    }
  }

  clear(): void {
    this._comparisonList.set([]);
    this.persist();
  }
}
