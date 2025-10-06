interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 100; // Keep only last 100 metrics

  startMeasure(name: string, metadata?: Record<string, any>): string {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    };
    
    this.metrics.push(metric);
    
    // Clean up old metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
    
    return `${name}_${metric.startTime}`;
  }

  endMeasure(name: string): number | null {
    const metricIndex = this.metrics.findIndex(
      m => m.name === name && !m.endTime
    );
    
    if (metricIndex === -1) {
      console.warn(`Performance metric "${name}" not found or already ended`);
      return null;
    }
    
    const metric = this.metrics[metricIndex];
    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    // Log slow operations
    if (metric.duration > 1000) { // More than 1 second
      console.warn(`Slow operation detected: ${name} took ${metric.duration.toFixed(2)}ms`);
    }
    
    return metric.duration;
  }

  async measureAsync<T>(name: string, asyncFn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    this.startMeasure(name, metadata);
    
    try {
      const result = await asyncFn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  measure<T>(name: string, syncFn: () => T, metadata?: Record<string, any>): T {
    this.startMeasure(name, metadata);
    
    try {
      const result = syncFn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics].filter(m => m.duration !== undefined);
  }

  getAverageTime(name: string): number {
    const relevantMetrics = this.metrics.filter(
      m => m.name === name && m.duration !== undefined
    );
    
    if (relevantMetrics.length === 0) return 0;
    
    const total = relevantMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    return total / relevantMetrics.length;
  }

  getSlowOperations(threshold: number = 500): PerformanceMetric[] {
    return this.metrics.filter(
      m => m.duration !== undefined && m.duration > threshold
    );
  }

  getStats(): {
    totalMeasurements: number;
    averageDuration: number;
    slowOperations: number;
    categories: Record<string, { count: number; averageDuration: number }>;
  } {
    const completedMetrics = this.metrics.filter(m => m.duration !== undefined);
    
    const totalDuration = completedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    const averageDuration = completedMetrics.length > 0 ? totalDuration / completedMetrics.length : 0;
    
    const slowOperations = completedMetrics.filter(m => (m.duration || 0) > 500).length;
    
    // Group by name for categories
    const categories: Record<string, { durations: number[]; count: number }> = {};
    
    completedMetrics.forEach(metric => {
      if (!categories[metric.name]) {
        categories[metric.name] = { durations: [], count: 0 };
      }
      categories[metric.name].durations.push(metric.duration || 0);
      categories[metric.name].count++;
    });
    
    const categoriesStats: Record<string, { count: number; averageDuration: number }> = {};
    
    Object.entries(categories).forEach(([name, data]) => {
      const avgDuration = data.durations.reduce((sum, d) => sum + d, 0) / data.durations.length;
      categoriesStats[name] = {
        count: data.count,
        averageDuration: avgDuration
      };
    });
    
    return {
      totalMeasurements: completedMetrics.length,
      averageDuration,
      slowOperations,
      categories: categoriesStats
    };
  }

  clear(): void {
    this.metrics = [];
  }

  // Web Vitals monitoring
  measureWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Measure First Contentful Paint
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime);
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Measure Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Measure Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Monitor memory usage (if available)
  getMemoryUsage(): any {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      return {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  // Resource timing analysis
  analyzeResourceTiming(): {
    totalResources: number;
    slowResources: Array<{ name: string; duration: number }>;
    resourceTypes: Record<string, number>;
  } {
    if (typeof window === 'undefined') return { totalResources: 0, slowResources: [], resourceTypes: {} };

    const resources = performance.getEntriesByType('resource');
    const slowResources: Array<{ name: string; duration: number }> = [];
    const resourceTypes: Record<string, number> = {};

    resources.forEach((resource: any) => {
      const duration = resource.responseEnd - resource.startTime;
      
      if (duration > 1000) { // Slow resources > 1s
        slowResources.push({
          name: resource.name,
          duration
        });
      }

      // Categorize by resource type
      const type = resource.initiatorType || 'other';
      resourceTypes[type] = (resourceTypes[type] || 0) + 1;
    });

    return {
      totalResources: resources.length,
      slowResources,
      resourceTypes
    };
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize web vitals monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.measureWebVitals();
}