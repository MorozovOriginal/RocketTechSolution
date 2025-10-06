/**
 * Database monitoring and logging utilities
 */

export interface DbOperation {
  id: string;
  type: 'read' | 'write' | 'delete' | 'sync';
  timestamp: number;
  duration?: number;
  success: boolean;
  recordCount?: number;
  error?: string;
  details?: any;
}

class DatabaseMonitor {
  private operations: DbOperation[] = [];
  private maxOperations = 100; // Keep last 100 operations

  /**
   * Log a database operation
   */
  logOperation(operation: Omit<DbOperation, 'id' | 'timestamp'>): string {
    const id = this.generateId();
    const logEntry: DbOperation = {
      id,
      timestamp: Date.now(),
      ...operation
    };

    this.operations.unshift(logEntry);
    
    // Keep only recent operations
    if (this.operations.length > this.maxOperations) {
      this.operations = this.operations.slice(0, this.maxOperations);
    }

    // Console logging with appropriate level
    const logMessage = `DB ${operation.type.toUpperCase()}: ${operation.success ? 'SUCCESS' : 'FAILED'}`;
    const logDetails = {
      duration: operation.duration,
      recordCount: operation.recordCount,
      error: operation.error,
      details: operation.details
    };

    if (operation.success) {
      console.log(logMessage, logDetails);
    } else {
      console.error(logMessage, logDetails);
    }

    return id;
  }

  /**
   * Start timing an operation
   */
  startOperation(type: DbOperation['type'], details?: any): string {
    const id = this.generateId();
    const startTime = performance.now();
    
    // Store start time for later completion
    (this as any)[`_start_${id}`] = { startTime, type, details };
    
    return id;
  }

  /**
   * Complete a timed operation
   */
  completeOperation(
    id: string, 
    success: boolean, 
    recordCount?: number, 
    error?: string,
    additionalDetails?: any
  ): void {
    const startData = (this as any)[`_start_${id}`];
    if (!startData) {
      console.warn(`No start data found for operation ${id}`);
      return;
    }

    const duration = Math.round(performance.now() - startData.startTime);
    
    this.logOperation({
      type: startData.type,
      duration,
      success,
      recordCount,
      error,
      details: { ...startData.details, ...additionalDetails }
    });

    // Clean up start data
    delete (this as any)[`_start_${id}`];
  }

  /**
   * Get recent operations
   */
  getRecentOperations(limit = 10): DbOperation[] {
    return this.operations.slice(0, limit);
  }

  /**
   * Get operation statistics
   */
  getStats(timeWindowMs = 5 * 60 * 1000): {
    totalOperations: number;
    successRate: number;
    averageDuration: number;
    operationsByType: Record<string, number>;
    errors: string[];
  } {
    const cutoff = Date.now() - timeWindowMs;
    const recentOps = this.operations.filter(op => op.timestamp > cutoff);

    const totalOperations = recentOps.length;
    const successfulOps = recentOps.filter(op => op.success);
    const successRate = totalOperations > 0 ? (successfulOps.length / totalOperations) * 100 : 100;

    const opsWithDuration = recentOps.filter(op => op.duration !== undefined);
    const averageDuration = opsWithDuration.length > 0 
      ? opsWithDuration.reduce((sum, op) => sum + (op.duration || 0), 0) / opsWithDuration.length
      : 0;

    const operationsByType: Record<string, number> = {};
    recentOps.forEach(op => {
      operationsByType[op.type] = (operationsByType[op.type] || 0) + 1;
    });

    const errors = recentOps
      .filter(op => !op.success && op.error)
      .map(op => op.error!)
      .filter((error, index, array) => array.indexOf(error) === index) // unique errors
      .slice(0, 5); // latest 5 unique errors

    return {
      totalOperations,
      successRate: Math.round(successRate * 10) / 10, // round to 1 decimal
      averageDuration: Math.round(averageDuration),
      operationsByType,
      errors
    };
  }

  /**
   * Clear operation history
   */
  clearHistory(): void {
    this.operations = [];
  }

  /**
   * Export operations for debugging
   */
  exportOperations(): string {
    return JSON.stringify(this.operations, null, 2);
  }

  private generateId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const dbMonitor = new DatabaseMonitor();

/**
 * Decorator for monitoring async database operations
 */
export function monitorDbOperation(type: DbOperation['type'], details?: any) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const operationId = dbMonitor.startOperation(type, { 
        method: propertyName, 
        ...details 
      });
      
      try {
        const result = await method.apply(this, args);
        
        // Try to extract record count from result
        let recordCount: number | undefined;
        if (result && typeof result === 'object') {
          if (Array.isArray(result.data)) {
            recordCount = result.data.length;
          } else if (typeof result.data === 'object' && result.data !== null) {
            recordCount = 1;
          }
        }
        
        dbMonitor.completeOperation(operationId, true, recordCount);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        dbMonitor.completeOperation(operationId, false, 0, errorMessage);
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Simple performance timing utility
 */
export class PerformanceTimer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = performance.now();
  }

  end(): number {
    const duration = Math.round(performance.now() - this.startTime);
    console.log(`${this.label}: ${duration}ms`);
    return duration;
  }
}

export const perf = {
  start: (label: string) => new PerformanceTimer(label),
  measure: function<T>(label: string, fn: () => T): T {
    const timer = new PerformanceTimer(label);
    try {
      const result = fn();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  },
  measureAsync: async function<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const timer = new PerformanceTimer(label);
    try {
      const result = await fn();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  }
};