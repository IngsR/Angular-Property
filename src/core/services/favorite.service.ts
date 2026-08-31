import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly STORAGE_KEY = 'properidecide_favorites';
  private _favorites = signal<string[]>(this.loadInitialState());

  readonly favorites = this._favorites.asReadonly();

  private loadInitialState(): string[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._favorites()));
    } catch (e) {
      console.warn('Failed to persist favorites', e);
    }
  }

  getFavorites(): string[] {
    return this._favorites();
  }

  isFavorite(id: string): boolean {
    return this._favorites().includes(id);
  }

  add(id: string): boolean {
    if (!this._favorites().includes(id)) {
      this._favorites.update(favs => [...favs, id]);
      this.persist();
      return true;
    }
    return false;
  }

  remove(id: string): boolean {
    if (this._favorites().includes(id)) {
      this._favorites.update(favs => favs.filter(f => f !== id));
      this.persist();
      return true;
    }
    return false;
  }

  toggle(id: string): boolean {
    if (this.isFavorite(id)) {
      this.remove(id);
      return false;
    } else {
      this.add(id);
      return true;
    }
  }

  clear(): void {
    this._favorites.set([]);
    this.persist();
  }
}
