import React, { useState, useEffect } from 'react';
import { Activity, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { performanceMonitor } from '../utils/performanceMonitor';
import { apiCache } from '../utils/apiCache';

interface PerformanceStatsProps {
  className?: string;
}

export default function PerformanceStats({ className = '' }: PerformanceStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    const updateStats = () => {
      try {
        const perfStats = performanceMonitor.getStats();
        const cacheInfo = apiCache.getStats();
        const memInfo = performanceMonitor.getMemoryUsage();
        
        setStats(perfStats);
        setCacheStats(cacheInfo);
        setMemoryInfo(memInfo);
      } catch (error) {
        console.error('Error getting performance stats:', error);
      }
    };

    // Update immediately and then every 10 seconds
    updateStats();
    const interval = setInterval(updateStats, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getPerformanceStatus = () => {
    if (!stats) return 'loading';
    if (stats.averageDuration < 500) return 'excellent';
    if (stats.averageDuration < 1000) return 'good';
    if (stats.averageDuration < 2000) return 'fair';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!stats) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-gray-500">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Loading performance data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = getPerformanceStatus();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Performance Monitor</span>
          </div>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Operations:</span>
            <span className="font-medium ml-1">{stats.totalMeasurements}</span>
          </div>
          <div>
            <span className="text-gray-500">Avg Time:</span>
            <span className="font-medium ml-1">{formatDuration(stats.averageDuration)}</span>
          </div>
          <div>
            <span className="text-gray-500">Slow Ops:</span>
            <span className="font-medium ml-1 text-orange-600">{stats.slowOperations}</span>
          </div>
          <div>
            <span className="text-gray-500">Cache Size:</span>
            <span className="font-medium ml-1">{cacheStats?.size || 0}</span>
          </div>
        </div>

        {/* Memory Usage (if available) */}
        {memoryInfo && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-700 mb-2">Memory Usage:</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Used:</span>
                <span>{formatBytes(memoryInfo.usedJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total:</span>
                <span>{formatBytes(memoryInfo.totalJSHeapSize)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cache Stats */}
        {cacheStats && cacheStats.size > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-700 mb-2">Cache Statistics:</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Memory:</span>
                <span>{formatBytes(cacheStats.totalMemoryEstimate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Entries:</span>
                <span>{cacheStats.size}</span>
              </div>
            </div>
          </div>
        )}

        {/* Top Categories */}
        {stats.categories && Object.keys(stats.categories).length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-700 mb-2">Top Operations:</p>
            <div className="space-y-1">
              {Object.entries(stats.categories)
                .sort(([,a]: any, [,b]: any) => b.count - a.count)
                .slice(0, 3)
                .map(([name, data]: [string, any]) => (
                  <div key={name} className="flex justify-between text-xs">
                    <span className="text-gray-600 truncate">{name}:</span>
                    <span className="text-gray-800 ml-1">
                      {data.count}x ({formatDuration(data.averageDuration)})
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => performanceMonitor.clear()}
            className="text-xs"
          >
            Clear Stats
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => apiCache.clear()}
            className="text-xs"
          >
            Clear Cache
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PerformanceStats;