type FavoriteListener = (favorites: string[]) => void;

export class FavoriteService {
  private static instance: FavoriteService;
  private readonly STORAGE_KEY = 'properidecide_favorites';
  private favorites: string[] = [];
  private listeners: Set<FavoriteListener> = new Set();

  private constructor() {
    this.loadInitialState();
  }

  public static getInstance(): FavoriteService {
    if (!FavoriteService.instance) {
      FavoriteService.instance = new FavoriteService();
    }
    return FavoriteService.instance;
  }

  private loadInitialState(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.favorites = JSON.parse(saved);
      }
    } catch {
      this.favorites = [];
    }
  }

  private persistAndNotify(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
    } catch (e) {
      console.warn('Failed to persist favorites to localStorage', e);
    }
    this.notify();
  }

  private notify(): void {
    const current = [...this.favorites];
    this.listeners.forEach((listener) => listener(current));
  }

  public getFavorites(): string[] {
    return [...this.favorites];
  }

  public isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  public add(id: string): boolean {
    if (!this.favorites.includes(id)) {
      this.favorites.push(id);
      this.persistAndNotify();
      return true;
    }
    return false;
  }

  public remove(id: string): boolean {
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter((favId) => favId !== id);
      this.persistAndNotify();
      return true;
    }
    return false;
  }

  public toggle(id: string): boolean {
    if (this.isFavorite(id)) {
      this.remove(id);
      return false; // Removed
    } else {
      this.add(id);
      return true; // Added
    }
  }

  public clear(): void {
    this.favorites = [];
    this.persistAndNotify();
  }

  public subscribe(listener: FavoriteListener): () => void {
    this.listeners.add(listener);
    listener([...this.favorites]);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const favoriteService = FavoriteService.getInstance();
