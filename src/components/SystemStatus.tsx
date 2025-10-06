import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Database, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import HealthCheck from './HealthCheck';
import { dbMonitor } from '../utils/dbMonitor';

interface SystemStatusProps {
  className?: string;
  showDetailed?: boolean;
  autoRefresh?: boolean;
}

export default function SystemStatus({ className = '', showDetailed = false, autoRefresh = false }: SystemStatusProps) {
  const [systemHealth, setSystemHealth] = useState<'checking' | 'healthy' | 'warning' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [operationStats, setOperationStats] = useState<any>(null);

  useEffect(() => {
    const checkSystemStatus = () => {
      try {
        // Get database monitoring stats
        const stats = dbMonitor.getStats();
        setOperationStats(stats);
        
        // Determine overall health based on recent operations
        if (stats.totalOperations === 0) {
          setSystemHealth('checking');
        } else if (stats.successRate >= 90) {
          setSystemHealth('healthy');
        } else if (stats.successRate >= 70) {
          setSystemHealth('warning');
        } else {
          setSystemHealth('error');
        }
        
        setLastCheck(new Date());
      } catch (error) {
        console.error('Error checking system status:', error);
        setSystemHealth('error');
        setLastCheck(new Date());
      }
    };

    // Initial check
    checkSystemStatus();
    
    // Only set up interval if autoRefresh is enabled
    let interval: NodeJS.Timeout | undefined;
    if (autoRefresh) {
      interval = setInterval(checkSystemStatus, 120000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  const getStatusIcon = () => {
    switch (systemHealth) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400 animate-pulse" />;
    }
  };

  const getStatusBadge = () => {
    switch (systemHealth) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Issues</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600">Checking</Badge>;
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  if (!showDetailed) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon()}
        <span className="text-sm text-gray-600">System Status</span>
        {getStatusBadge()}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>System Status</span>
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Health */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm">Overall Health</span>
          </div>
          <span className="text-sm text-gray-500">
            {operationStats ? `${operationStats.successRate}% success` : 'Checking...'}
          </span>
        </div>

        {/* Operation Statistics */}
        {operationStats && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Operations:</span>
              <span className="font-medium ml-1">{operationStats.totalOperations}</span>
            </div>
            <div>
              <span className="text-gray-500">Avg Time:</span>
              <span className="font-medium ml-1">{operationStats.averageDuration}ms</span>
            </div>
            <div>
              <span className="text-gray-500">Errors:</span>
              <span className="font-medium ml-1 text-red-600">{operationStats.errors.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Check:</span>
              <span className="font-medium ml-1">{formatTime(lastCheck)}</span>
            </div>
          </div>
        )}

        {/* Detailed Health Check */}
        <div className="pt-3 border-t border-gray-100">
          <HealthCheck showDetails={false} />
        </div>

        {/* Recent Errors */}
        {operationStats && operationStats.errors.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-red-700 mb-2">Recent Issues:</p>
            <div className="space-y-1">
              {operationStats.errors.slice(0, 2).map((error: string, index: number) => (
                <p key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded truncate">
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}