import { caseStudiesApi, type CaseStudy as ApiCaseStudy } from './caseStudiesApi';
import { safeLocalStorage } from './safeLocalStorage';

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  descriptionRu?: string;
  icon: React.ComponentType<any>;
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

export interface SyncOptions {
  force?: boolean; // Force sync even if timestamps match
  direction?: 'toDb' | 'fromDb' | 'auto'; // Sync direction
  onProgress?: (progress: { current: number; total: number; action: string }) => void;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

class CaseStudiesSync {
  private iconMapping: Record<string, React.ComponentType<any>> = {};

  constructor(iconMapping: Record<string, React.ComponentType<any>>) {
    this.iconMapping = iconMapping;
  }

  /**
   * Convert API case study to local format
   */
  private apiToLocal(apiCase: ApiCaseStudy): CaseStudy {
    return {
      ...apiCase,
      icon: this.iconMapping[apiCase.iconName] || this.iconMapping['MessageSquare']
    };
  }

  /**
   * Convert local case study to API format
   */
  private localToApi(localCase: CaseStudy): Omit<ApiCaseStudy, 'id' | 'createdAt' | 'updatedAt'> {
    const iconName = Object.keys(this.iconMapping).find(key => 
      this.iconMapping[key] === localCase.icon
    ) || 'MessageSquare';

    return {
      title: localCase.title,
      description: localCase.description,
      descriptionRu: localCase.descriptionRu,
      iconName,
      image: localCase.image,
      technologies: localCase.technologies,
      fullDescription: localCase.fullDescription,
      fullDescriptionRu: localCase.fullDescriptionRu,
      uniqueFeatures: localCase.uniqueFeatures,
      uniqueFeaturesRu: localCase.uniqueFeaturesRu,
      keyBenefits: localCase.keyBenefits,
      keyBenefitsRu: localCase.keyBenefitsRu,
      additionalImages: localCase.additionalImages,
      category: localCase.category,
      industry: localCase.industry,
      timeframe: localCase.timeframe,
      result: localCase.result,
      showOnHomepage: localCase.showOnHomepage
    };
  }

  /**
   * Get case studies from localStorage
   */
  private getLocalCases(): CaseStudy[] {
    try {
      const saved = safeLocalStorage.getJSON<any[]>('allSolutions_cases');
      if (!saved || !Array.isArray(saved)) return [];
      
      return saved.map(study => ({
        ...study,
        icon: this.iconMapping[study.iconName] || this.iconMapping['MessageSquare']
      }));
    } catch (error) {
      console.error('Error reading local cases:', error);
      return [];
    }
  }

  /**
   * Save case studies to localStorage
   */
  private saveLocalCases(cases: CaseStudy[]): void {
    try {
      const casesToSave = cases.map(study => ({
        ...study,
        iconName: Object.keys(this.iconMapping).find(key => 
          this.iconMapping[key] === study.icon
        ) || 'MessageSquare'
      }));
      
      const success = safeLocalStorage.setJSON('allSolutions_cases', casesToSave);
      if (!success) {
        throw new Error('Failed to save to localStorage');
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('allSolutionsUpdated'));
    } catch (error) {
      console.error('Error saving local cases:', error);
      throw error;
    }
  }

  /**
   * Sync from database to localStorage
   */
  async syncFromDatabase(options: SyncOptions = {}): Promise<CaseStudy[]> {
    const { onProgress, onError, onSuccess } = options;
    
    try {
      onProgress?.({ current: 0, total: 1, action: 'Connecting to database...' });
      
      const response = await caseStudiesApi.getAllCaseStudies();
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch from database');
      }

      onProgress?.({ current: 1, total: 2, action: 'Converting data format...' });
      
      const localCases = response.data.map(apiCase => this.apiToLocal(apiCase));
      
      onProgress?.({ current: 2, total: 2, action: 'Saving to local storage...' });
      
      this.saveLocalCases(localCases);
      
      onSuccess?.(`Successfully synced ${localCases.length} case studies from database`);
      return localCases;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError?.(`Failed to sync from database: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Sync from localStorage to database
   */
  async syncToDatabase(options: SyncOptions = {}): Promise<ApiCaseStudy[]> {
    const { onProgress, onError, onSuccess } = options;
    
    try {
      const localCases = this.getLocalCases();
      
      if (localCases.length === 0) {
        onError?.('No local case studies to sync');
        return [];
      }

      onProgress?.({ current: 0, total: localCases.length + 1, action: 'Preparing data...' });
      
      const apiCases = localCases.map(localCase => ({
        ...this.localToApi(localCase),
        id: localCase.id,
        createdAt: localCase.createdAt,
        updatedAt: localCase.updatedAt
      })) as ApiCaseStudy[];

      onProgress?.({ current: 1, total: localCases.length + 1, action: 'Uploading to database...' });
      
      const response = await caseStudiesApi.bulkUpdateCaseStudies(apiCases);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to upload to database');
      }

      onProgress?.({ current: localCases.length + 1, total: localCases.length + 1, action: 'Sync complete' });
      
      onSuccess?.(`Successfully synced ${apiCases.length} case studies to database`);
      return response.data;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError?.(`Failed to sync to database: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Auto-sync: Choose direction based on timestamps and data availability
   */
  async autoSync(options: SyncOptions = {}): Promise<{ direction: string; cases: CaseStudy[] }> {
    const { onProgress, onError, onSuccess } = options;
    
    try {
      onProgress?.({ current: 0, total: 3, action: 'Analyzing sync requirements...' });
      
      const localCases = this.getLocalCases();
      const dbResponse = await caseStudiesApi.getAllCaseStudies();
      
      onProgress?.({ current: 1, total: 3, action: 'Comparing data sources...' });
      
      // If database is empty but local has data, sync to database
      if ((!dbResponse.success || !dbResponse.data || dbResponse.data.length === 0) && localCases.length > 0) {
        onProgress?.({ current: 2, total: 3, action: 'Syncing local data to database...' });
        await this.syncToDatabase({ ...options, onProgress: undefined });
        onSuccess?.('Auto-sync: Uploaded local data to database');
        return { direction: 'toDb', cases: localCases };
      }
      
      // If local is empty but database has data, sync from database
      if (localCases.length === 0 && dbResponse.success && dbResponse.data && dbResponse.data.length > 0) {
        onProgress?.({ current: 2, total: 3, action: 'Syncing database to local...' });
        const syncedCases = await this.syncFromDatabase({ ...options, onProgress: undefined });
        onSuccess?.('Auto-sync: Downloaded data from database');
        return { direction: 'fromDb', cases: syncedCases };
      }
      
      // If both have data, prefer database (latest source of truth)
      if (dbResponse.success && dbResponse.data && dbResponse.data.length > 0) {
        onProgress?.({ current: 2, total: 3, action: 'Syncing database to local...' });
        const syncedCases = await this.syncFromDatabase({ ...options, onProgress: undefined });
        onSuccess?.('Auto-sync: Synced from database (source of truth)');
        return { direction: 'fromDb', cases: syncedCases };
      }
      
      // Fallback: use local data
      onProgress?.({ current: 3, total: 3, action: 'Using local data...' });
      onSuccess?.('Auto-sync: Using local data (no database data available)');
      return { direction: 'local', cases: localCases };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError?.(`Auto-sync failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Get sync status and recommendations
   */
  async getSyncStatus(): Promise<{
    local: { count: number; lastUpdated?: string };
    database: { count: number; lastUpdated?: string };
    recommendation: 'syncToDb' | 'syncFromDb' | 'noSyncNeeded' | 'conflict';
  }> {
    try {
      const localCases = this.getLocalCases();
      const dbResponse = await caseStudiesApi.getAllCaseStudies();
      
      const local = {
        count: localCases.length,
        lastUpdated: localCases.length > 0 ? 
          Math.max(...localCases.map(c => new Date(c.updatedAt || c.createdAt || 0).getTime())).toString() : 
          undefined
      };
      
      const database = {
        count: dbResponse.success && dbResponse.data ? dbResponse.data.length : 0,
        lastUpdated: dbResponse.success && dbResponse.data && dbResponse.data.length > 0 ?
          Math.max(...dbResponse.data.map(c => new Date(c.updatedAt || c.createdAt || 0).getTime())).toString() :
          undefined
      };
      
      let recommendation: 'syncToDb' | 'syncFromDb' | 'noSyncNeeded' | 'conflict';
      
      if (local.count === 0 && database.count === 0) {
        recommendation = 'noSyncNeeded';
      } else if (local.count > 0 && database.count === 0) {
        recommendation = 'syncToDb';
      } else if (local.count === 0 && database.count > 0) {
        recommendation = 'syncFromDb';
      } else if (local.count !== database.count) {
        recommendation = 'conflict';
      } else {
        recommendation = 'noSyncNeeded';
      }
      
      return { local, database, recommendation };
      
    } catch (error) {
      console.error('Error getting sync status:', error);
      throw error;
    }
  }
}

export default CaseStudiesSync;