import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader, Database, Server, Wifi } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { caseStudiesApi } from '../utils/caseStudiesApi';

interface HealthStatus {
  database: 'healthy' | 'unhealthy' | 'checking';
  api: 'healthy' | 'unhealthy' | 'checking';
  connectivity: 'healthy' | 'unhealthy' | 'checking';
  overall: 'healthy' | 'unhealthy' | 'checking';
}

interface HealthCheckProps {
  className?: string;
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function HealthCheck({ 
  className = '', 
  showDetails = false,
  autoRefresh = false, // Disabled by default to prevent API spam
  refreshInterval = 300000 // 5 minutes when enabled
}: HealthCheckProps) {
  const [status, setStatus] = useState<HealthStatus>({
    database: 'checking',
    api: 'checking',
    connectivity: 'checking',
    overall: 'checking'
  });
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setStatus(prev => ({ ...prev, overall: 'checking' }));
    setError(null);

    try {
      // Check API health
      const healthResponse = await caseStudiesApi.healthCheck();
      const apiHealthy = healthResponse.success;
      const databaseHealthy = healthResponse.success && 
                             healthResponse.data?.database === 'connected';

      // Check basic connectivity
      const connectivityHealthy = navigator.onLine;

      const newStatus: HealthStatus = {
        api: apiHealthy ? 'healthy' : 'unhealthy',
        database: databaseHealthy ? 'healthy' : 'unhealthy',
        connectivity: connectivityHealthy ? 'healthy' : 'unhealthy',
        overall: (apiHealthy && databaseHealthy && connectivityHealthy) ? 'healthy' : 'unhealthy'
      };

      setStatus(newStatus);
      setLastCheck(new Date());

      if (!healthResponse.success) {
        setError(healthResponse.error || 'Health check failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Health check failed';
      setError(errorMessage);
      setStatus({
        database: 'unhealthy',
        api: 'unhealthy',
        connectivity: 'unhealthy',
        overall: 'unhealthy'
      });
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkHealth();
    
    if (autoRefresh) {
      const interval = setInterval(checkHealth, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getStatusIcon = (status: 'healthy' | 'unhealthy' | 'checking') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <Loader className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusBadge = (status: 'healthy' | 'unhealthy' | 'checking') => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800 text-xs">Healthy</Badge>;
      case 'unhealthy':
        return <Badge className="bg-red-100 text-red-800 text-xs">Error</Badge>;
      case 'checking':
        return <Badge className="bg-gray-100 text-gray-600 text-xs">Checking</Badge>;
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  if (!showDetails) {
    // Compact view - just overall status
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon(status.overall)}
        <span className="text-sm text-gray-600">
          System {status.overall === 'checking' ? 'checking' : status.overall}
        </span>
        {error && (
          <AlertCircle className="w-4 h-4 text-amber-500" title={error} />
        )}
      </div>
    );
  }

  // Detailed view
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Overall Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(status.overall)}
              <span className="font-medium text-sm">System Health</span>
            </div>
            {getStatusBadge(status.overall)}
          </div>

          {/* Individual Components */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-3 h-3 text-gray-400" />
                <span>Database</span>
              </div>
              {getStatusIcon(status.database)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="w-3 h-3 text-gray-400" />
                <span>API</span>
              </div>
              {getStatusIcon(status.api)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="w-3 h-3 text-gray-400" />
                <span>Connectivity</span>
              </div>
              {getStatusIcon(status.connectivity)}
            </div>
          </div>

          {/* Last Check Time */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Last check: {formatTime(lastCheck)}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">{error}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}