type ComparisonListener = (comparisonList: string[]) => void;

export class ComparisonService {
  private static instance: ComparisonService;
  private readonly STORAGE_KEY = 'properidecide_comparison';
  public readonly MAX_COMPARISON_ITEMS = 2; // Strict limit: max 2 properties

  private comparisonList: string[] = [];
  private listeners: Set<ComparisonListener> = new Set();

  private constructor() {
    this.loadInitialState();
  }

  public static getInstance(): ComparisonService {
    if (!ComparisonService.instance) {
      ComparisonService.instance = new ComparisonService();
    }
    return ComparisonService.instance;
  }

  private loadInitialState(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure max 2
        this.comparisonList = Array.isArray(parsed) ? parsed.slice(0, this.MAX_COMPARISON_ITEMS) : [];
      }
    } catch {
      this.comparisonList = [];
    }
  }

  private persistAndNotify(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.comparisonList));
    } catch (e) {
      console.warn('Failed to persist comparison list to localStorage', e);
    }
    this.notify();
  }

  private notify(): void {
    const current = [...this.comparisonList];
    this.listeners.forEach((listener) => listener(current));
  }

  public getComparisonList(): string[] {
    return [...this.comparisonList];
  }

  public isInComparison(id: string): boolean {
    return this.comparisonList.includes(id);
  }

  public add(id: string): { success: boolean; message?: string } {
    if (this.comparisonList.includes(id)) {
      return { success: false, message: 'Properti sudah ada di perbandingan' };
    }
    if (this.comparisonList.length >= this.MAX_COMPARISON_ITEMS) {
      return {
        success: false,
        message: `Maksimal ${this.MAX_COMPARISON_ITEMS} properti untuk dibandingkan`,
      };
    }
    this.comparisonList.push(id);
    this.persistAndNotify();
    return { success: true, message: 'Properti ditambahkan ke perbandingan' };
  }

  public remove(id: string): boolean {
    if (this.comparisonList.includes(id)) {
      this.comparisonList = this.comparisonList.filter((item) => item !== id);
      this.persistAndNotify();
      return true;
    }
    return false;
  }

  public toggle(id: string): { isInComparison: boolean; message: string } {
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

  public clear(): void {
    this.comparisonList = [];
    this.persistAndNotify();
  }

  public subscribe(listener: ComparisonListener): () => void {
    this.listeners.add(listener);
    listener([...this.comparisonList]);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const comparisonService = ComparisonService.getInstance();
