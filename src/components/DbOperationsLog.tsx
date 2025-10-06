import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, XCircle, Database, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { dbMonitor, type DbOperation } from '../utils/dbMonitor';

interface DbOperationsLogProps {
  maxOperations?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function DbOperationsLog({ 
  maxOperations = 5, 
  autoRefresh = true, 
  refreshInterval = 3000 
}: DbOperationsLogProps) {
  const [operations, setOperations] = useState<DbOperation[]>([]);
  const [stats, setStats] = useState<any>(null);

  const refreshOperations = () => {
    const recentOps = dbMonitor.getRecentOperations(maxOperations);
    const currentStats = dbMonitor.getStats();
    setOperations(recentOps);
    setStats(currentStats);
  };

  useEffect(() => {
    refreshOperations();
    
    if (autoRefresh) {
      const interval = setInterval(refreshOperations, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [maxOperations, autoRefresh, refreshInterval]);

  const getOperationIcon = (type: DbOperation['type'], success: boolean) => {
    const iconClass = "w-3 h-3";
    const color = success ? "text-green-500" : "text-red-500";
    
    switch (type) {
      case 'read':
        return <Database className={`${iconClass} ${color}`} />;
      case 'write':
        return <CheckCircle className={`${iconClass} ${color}`} />;
      case 'delete':
        return <XCircle className={`${iconClass} ${color}`} />;
      case 'sync':
        return <RefreshCw className={`${iconClass} ${color}`} />;
      default:
        return <Activity className={`${iconClass} ${color}`} />;
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '-';
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getOperationTypeColor = (type: DbOperation['type']) => {
    switch (type) {
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'write': return 'bg-green-100 text-green-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'sync': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (operations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Database Operations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 text-center py-4">
            No recent operations recorded
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Recent Operations</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {stats && (
              <Badge variant="outline" className="text-xs h-5">
                {stats.successRate}% success
              </Badge>
            )}
            <Button
              onClick={refreshOperations}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs">
          Last {operations.length} database operations
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {operations.map((operation) => (
            <div
              key={operation.id}
              className={`flex items-center justify-between p-2 rounded-md border ${
                operation.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {getOperationIcon(operation.type, operation.success)}
                
                <Badge className={`text-xs px-2 py-0 ${getOperationTypeColor(operation.type)}`}>
                  {operation.type.toUpperCase()}
                </Badge>
                
                {operation.recordCount !== undefined && (
                  <span className="text-xs text-gray-500">
                    {operation.recordCount} records
                  </span>
                )}
                
                {operation.error && (
                  <span className="text-xs text-red-600 truncate flex-1 min-w-0">
                    {operation.error}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500 flex-shrink-0">
                {operation.duration && (
                  <span>{formatDuration(operation.duration)}</span>
                )}
                <Clock className="w-3 h-3" />
                <span>{formatTime(operation.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {stats && stats.errors.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-red-700 mb-1">Recent Errors:</p>
            <div className="space-y-1">
              {stats.errors.slice(0, 2).map((error: string, index: number) => (
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