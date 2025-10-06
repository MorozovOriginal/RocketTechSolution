import React, { useState, useEffect } from 'react';
import { Database, Clock, AlertCircle, CheckCircle, Activity, BarChart } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import CaseStudiesSync from '../utils/caseStudiesSync';
import { caseStudiesApi } from '../utils/caseStudiesApi';
import DbStats from './DbStats';

interface SyncStatusProps {
  iconMapping: Record<string, React.ComponentType<any>>;
  onSyncTrigger: () => void;
  isLoading?: boolean;
}

interface SyncInfo {
  local: { count: number; lastUpdated?: string };
  database: { count: number; lastUpdated?: string };
  recommendation: 'syncToDb' | 'syncFromDb' | 'noSyncNeeded' | 'conflict';
}

export default function SyncStatus({ iconMapping, onSyncTrigger, isLoading }: SyncStatusProps) {
  const [syncInfo, setSyncInfo] = useState<SyncInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbHealth, setDbHealth] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [showDbStats, setShowDbStats] = useState(false);

  const checkSyncStatus = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      // Check database health first
      const healthResponse = await caseStudiesApi.healthCheck();
      setDbHealth(healthResponse.success ? 'healthy' : 'unhealthy');
      
      // Get sync status
      const sync = new CaseStudiesSync(iconMapping);
      const status = await sync.getSyncStatus();
      setSyncInfo(status);
      
      // Get statistics if requested
      if (showStats) {
        const statsResponse = await caseStudiesApi.getStatistics();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check sync status');
      setDbHealth('unhealthy');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkSyncStatus();
  }, [iconMapping]);

  const getStatusColor = (recommendation: string) => {
    switch (recommendation) {
      case 'noSyncNeeded': return 'bg-green-500';
      case 'syncToDb': return 'bg-blue-500';
      case 'syncFromDb': return 'bg-yellow-500';
      case 'conflict': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (recommendation: string) => {
    switch (recommendation) {
      case 'noSyncNeeded': return 'In Sync';
      case 'syncToDb': return 'Upload Needed';
      case 'syncFromDb': return 'Download Needed';
      case 'conflict': return 'Conflict';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'noSyncNeeded': return <CheckCircle className="w-4 h-4" />;
      case 'syncToDb': return <Database className="w-4 h-4" />;
      case 'syncFromDb': return <Database className="w-4 h-4" />;
      case 'conflict': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    try {
      const date = new Date(parseInt(timestamp));
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Sync Check Failed</span>
        </div>
        <p className="text-xs text-red-500 mt-1">{error}</p>
        <Button
          onClick={checkSyncStatus}
          size="sm"
          variant="outline"
          className="mt-2 text-xs h-6"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (isChecking || !syncInfo) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">Checking sync status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Database Sync</span>
          <div className={`w-2 h-2 rounded-full ${
            dbHealth === 'healthy' ? 'bg-green-500' : 
            dbHealth === 'unhealthy' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`}></div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            className={`${getStatusColor(syncInfo.recommendation)} text-white text-xs flex items-center space-x-1`}
          >
            {getStatusIcon(syncInfo.recommendation)}
            <span>{getStatusText(syncInfo.recommendation)}</span>
          </Badge>
          
          <Button
            onClick={() => setShowDbStats(true)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            title="View detailed statistics"
          >
            <BarChart className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-gray-500">Local Storage</div>
          <div className="font-medium">{syncInfo.local.count} cases</div>
          <div className="text-gray-400">
            {formatDate(syncInfo.local.lastUpdated)}
          </div>
        </div>
        
        <div>
          <div className="text-gray-500">Database</div>
          <div className="font-medium">{syncInfo.database.count} cases</div>
          <div className="text-gray-400">
            {formatDate(syncInfo.database.lastUpdated)}
          </div>
        </div>
      </div>

      {syncInfo.recommendation !== 'noSyncNeeded' && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <Button
            onClick={onSyncTrigger}
            disabled={isLoading}
            size="sm"
            className="w-full h-7 text-xs bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024]"
          >
            {isLoading ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      )}

      <Button
        onClick={checkSyncStatus}
        variant="ghost"
        size="sm"
        className="w-full h-6 text-xs text-gray-500 hover:text-gray-700 mt-1"
      >
        Refresh Status
      </Button>

      {/* Extended Statistics */}
      {showStats && stats && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          <div className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>Statistics</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Homepage:</span>
              <span className="font-medium ml-1">{stats.homepageCases}</span>
            </div>
            <div>
              <span className="text-gray-500">Categories:</span>
              <span className="font-medium ml-1">{Object.keys(stats.categoriesBreakdown).length}</span>
            </div>
          </div>
          
          {stats.lastUpdated && (
            <div className="text-xs text-gray-400">
              Last updated: {formatDate(stats.lastUpdated)}
            </div>
          )}
        </div>
      )}

      {/* Database Statistics Modal */}
      {showDbStats && (
        <DbStats onClose={() => setShowDbStats(false)} />
      )}
    </div>
  );
}