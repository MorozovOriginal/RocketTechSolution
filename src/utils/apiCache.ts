interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class ApiCache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
    
    this.cache.set(key, item);
    
    // Clean up expired items periodically
    this.cleanup();
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): {
    size: number;
    keys: string[];
    totalMemoryEstimate: number;
  } {
    const keys = Array.from(this.cache.keys());
    const totalMemoryEstimate = keys.reduce((total, key) => {
      const item = this.cache.get(key);
      if (item) {
        return total + JSON.stringify(item).length;
      }
      return total;
    }, 0);

    return {
      size: this.cache.size,
      keys,
      totalMemoryEstimate
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        toDelete.push(key);
      }
    }
    
    toDelete.forEach(key => this.cache.delete(key));
  }

  // Cache with refresh strategy
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = this.defaultTTL,
    refreshThreshold: number = 0.8 // Refresh when 80% of TTL has passed
  ): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached) {
      const timeRemaining = cached.expiry - Date.now();
      const refreshTime = ttl * refreshThreshold;
      
      // If cache is still valid but approaching expiry, refresh in background
      if (timeRemaining < refreshTime) {
        this.refreshInBackground(key, fetchFn, ttl);
      }
      
      return cached.data as T;
    }
    
    // No cache, fetch fresh data
    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }

  private async refreshInBackground<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number
  ): Promise<void> {
    try {
      const data = await fetchFn();
      this.set(key, data, ttl);
    } catch (error) {
      console.warn(`Background refresh failed for key ${key}:`, error);
    }
  }
}

// Export singleton instance
export const apiCache = new ApiCache();

// Cache keys constants
export const CACHE_KEYS = {
  CASE_STUDIES: 'case_studies',
  CASE_STUDY: (id: string) => `case_study_${id}`,
  HEALTH_CHECK: 'health_check',
  STATS: 'case_studies_stats',
  HOMEPAGE_SOLUTIONS: 'homepage_solutions'
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 30 * 1000,      // 30 seconds
  MEDIUM: 5 * 60 * 1000,  // 5 minutes
  LONG: 30 * 60 * 1000,   // 30 minutes
  HEALTH: 60 * 1000       // 1 minute for health checks
} as const;