/**
 * Simple system test utilities for verifying database integration
 */

import { dbMonitor, perf } from './dbMonitor';
import { caseStudiesApi } from './caseStudiesApi';

export class SystemTest {
  private results: Array<{ test: string; success: boolean; error?: string; duration?: number }> = [];

  /**
   * Run basic system connectivity tests
   */
  async runBasicTests(): Promise<boolean> {
    console.log('🚀 Starting system tests...');
    
    // Test 1: Database monitoring system
    try {
      const timer = perf.start('Monitor Test');
      dbMonitor.logOperation({
        type: 'read',
        success: true,
        recordCount: 1,
        details: { test: 'system-test' }
      });
      const duration = timer.end();
      
      this.results.push({ 
        test: 'Database Monitor', 
        success: true, 
        duration 
      });
    } catch (error) {
      this.results.push({ 
        test: 'Database Monitor', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Performance measurement
    try {
      const result = perf.measure('Sync Performance Test', () => {
        // Simulate some work
        return 'test-result';
      });
      
      this.results.push({ 
        test: 'Performance Measurement', 
        success: result === 'test-result'
      });
    } catch (error) {
      this.results.push({ 
        test: 'Performance Measurement', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Health check endpoint
    try {
      const healthResult = await caseStudiesApi.healthCheck();
      this.results.push({ 
        test: 'Health Check API', 
        success: healthResult.success || false
      });
    } catch (error) {
      this.results.push({ 
        test: 'Health Check API', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: Statistics gathering
    try {
      const stats = dbMonitor.getStats();
      this.results.push({ 
        test: 'Statistics Collection', 
        success: typeof stats.totalOperations === 'number'
      });
    } catch (error) {
      this.results.push({ 
        test: 'Statistics Collection', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return this.results.every(result => result.success);
  }

  /**
   * Get test results summary
   */
  getResults() {
    return {
      total: this.results.length,
      passed: this.results.filter(r => r.success).length,
      failed: this.results.filter(r => !r.success).length,
      results: this.results
    };
  }

  /**
   * Print test results to console
   */
  printResults(): void {
    const summary = this.getResults();
    
    console.log(`\n📊 System Test Results:`);
    console.log(`Total: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}`);
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const duration = result.duration ? ` (${result.duration}ms)` : '';
      const error = result.error ? ` - ${result.error}` : '';
      
      console.log(`${status} ${result.test}${duration}${error}`);
    });
    
    if (summary.failed === 0) {
      console.log('🎉 All tests passed! System is operational.');
    } else {
      console.log(`⚠️  ${summary.failed} test(s) failed. Check system configuration.`);
    }
  }

  /**
   * Clear test results
   */
  clear(): void {
    this.results = [];
  }
}

/**
 * Quick system verification
 */
export async function quickSystemCheck(): Promise<boolean> {
  const test = new SystemTest();
  const success = await test.runBasicTests();
  test.printResults();
  return success;
}

/**
 * Export singleton instance for convenience
 */
export const systemTest = new SystemTest();