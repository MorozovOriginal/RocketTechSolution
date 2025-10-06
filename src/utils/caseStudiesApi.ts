import { projectId, publicAnonKey } from './supabase/info';
import { dbMonitor, perf } from './dbMonitor';
import { apiCache, CACHE_KEYS, CACHE_TTL } from './apiCache';
import { performanceMonitor } from './performanceMonitor';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d44bd96a`;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  descriptionRu?: string;
  iconName: string;
  image: string;
  technologies: string[];
  fullDescription: string;
  fullDescriptionRu?: string;
  uniqueFeatures: string[];
  uniqueFeaturesRu?: string[];
  keyBenefits: string[];
  keyBenefitsRu?: string[];
  additionalImages: string[];
  category: string;
  industry: string;
  timeframe: string;
  result: string;
  showOnHomepage?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class CaseStudiesApi {
  private healthCache: { result: any; timestamp: number } | null = null;
  private readonly HEALTH_CACHE_DURATION = 60000; // 1 minute cache

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const operationType = options.method === 'POST' || options.method === 'PUT' ? 'write' : 
                         options.method === 'DELETE' ? 'delete' : 'read';
    
    return await perf.measureAsync(`API ${operationType.toUpperCase()} ${endpoint}`, async () => {
      const operationId = dbMonitor.startOperation(operationType, { endpoint, method: options.method || 'GET' });
      
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            ...options.headers,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract record count if possible
        let recordCount: number | undefined;
        if (data.success && data.data) {
          if (Array.isArray(data.data)) {
            recordCount = data.data.length;
          } else if (typeof data.data === 'object') {
            recordCount = 1;
          }
        }
        
        dbMonitor.completeOperation(operationId, data.success, recordCount, data.error);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        dbMonitor.completeOperation(operationId, false, 0, errorMessage);
        console.error(`API request failed for ${endpoint}:`, error);
        return {
          success: false,
          error: errorMessage
        };
      }
    });
  }

  // Get all case studies with caching
  async getAllCaseStudies(): Promise<ApiResponse<CaseStudy[]>> {
    console.log('Fetching all case studies from database...');
    
    return await apiCache.getOrFetch(
      CACHE_KEYS.CASE_STUDIES,
      () => this.makeRequest<CaseStudy[]>('/casestudies'),
      CACHE_TTL.MEDIUM
    );
  }

  // Get single case study with caching
  async getCaseStudy(id: string): Promise<ApiResponse<CaseStudy>> {
    console.log(`Fetching case study ${id} from database...`);
    
    return await apiCache.getOrFetch(
      CACHE_KEYS.CASE_STUDY(id),
      () => this.makeRequest<CaseStudy>(`/casestudies/${id}`),
      CACHE_TTL.MEDIUM
    );
  }

  // Create new case study
  async createCaseStudy(caseStudy: Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<CaseStudy>> {
    console.log('Creating new case study in database...', caseStudy);
    
    const result = await performanceMonitor.measureAsync(
      'create_case_study',
      () => this.makeRequest<CaseStudy>('/casestudies', {
        method: 'POST',
        body: JSON.stringify(caseStudy),
      })
    );
    
    // Invalidate cache after successful creation
    if (result.success) {
      apiCache.delete(CACHE_KEYS.CASE_STUDIES);
      apiCache.delete(CACHE_KEYS.HOMEPAGE_SOLUTIONS);
    }
    
    return result;
  }

  // Update existing case study
  async updateCaseStudy(id: string, caseStudy: Partial<CaseStudy>): Promise<ApiResponse<CaseStudy>> {
    console.log(`Updating case study ${id} in database...`, caseStudy);
    
    const result = await performanceMonitor.measureAsync(
      'update_case_study',
      () => this.makeRequest<CaseStudy>(`/casestudies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(caseStudy),
      })
    );
    
    // Invalidate cache after successful update
    if (result.success) {
      apiCache.delete(CACHE_KEYS.CASE_STUDIES);
      apiCache.delete(CACHE_KEYS.CASE_STUDY(id));
      apiCache.delete(CACHE_KEYS.HOMEPAGE_SOLUTIONS);
    }
    
    return result;
  }

  // Delete case study
  async deleteCaseStudy(id: string): Promise<ApiResponse<void>> {
    console.log(`Deleting case study ${id} from database...`);
    
    const result = await performanceMonitor.measureAsync(
      'delete_case_study',
      () => this.makeRequest<void>(`/casestudies/${id}`, {
        method: 'DELETE',
      })
    );
    
    // Invalidate cache after successful deletion
    if (result.success) {
      apiCache.delete(CACHE_KEYS.CASE_STUDIES);
      apiCache.delete(CACHE_KEYS.CASE_STUDY(id));
      apiCache.delete(CACHE_KEYS.HOMEPAGE_SOLUTIONS);
    }
    
    return result;
  }

  // Bulk update case studies
  async bulkUpdateCaseStudies(caseStudies: CaseStudy[]): Promise<ApiResponse<CaseStudy[]>> {
    console.log(`Bulk updating ${caseStudies.length} case studies in database...`);
    
    const result = await performanceMonitor.measureAsync(
      'bulk_update_case_studies',
      () => this.makeRequest<CaseStudy[]>('/casestudies', {
        method: 'PUT',
        body: JSON.stringify({ caseStudies }),
      })
    );
    
    // Invalidate cache after successful bulk update
    if (result.success) {
      apiCache.clear(); // Clear all cache for bulk operations
    }
    
    return result;
  }

  // Get case studies statistics with caching
  async getStatistics(): Promise<ApiResponse<{
    totalCases: number;
    homepageCases: number;
    categoriesBreakdown: Record<string, number>;
    industriesBreakdown: Record<string, number>;
    lastUpdated: string | null;
  }>> {
    console.log('Getting case studies statistics...');
    
    return await apiCache.getOrFetch(
      CACHE_KEYS.STATS,
      () => this.makeRequest('/case-studies/stats'),
      CACHE_TTL.SHORT
    );
  }

  // Health check with caching
  async healthCheck(): Promise<ApiResponse<{
    status: string;
    database: string;
    timestamp: string;
  }>> {
    const now = Date.now();
    
    // Return cached result if still valid
    if (this.healthCache && (now - this.healthCache.timestamp) < this.HEALTH_CACHE_DURATION) {
      console.log('Returning cached health check result');
      return this.healthCache.result;
    }
    
    console.log('Performing fresh health check...');
    const result = await this.makeRequest('/health');
    
    // Cache successful results
    if (result.success) {
      this.healthCache = {
        result,
        timestamp: now
      };
    }
    
    return result;
  }
}

export const caseStudiesApi = new CaseStudiesApi();