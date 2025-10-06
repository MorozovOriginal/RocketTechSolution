import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Database, Users, Home, Tag, Building, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { caseStudiesApi } from '../utils/caseStudiesApi';
import { dbMonitor } from '../utils/dbMonitor';

interface DbStatsProps {
  onClose: () => void;
}

interface DatabaseStats {
  totalCases: number;
  homepageCases: number;
  categoriesBreakdown: Record<string, number>;
  industriesBreakdown: Record<string, number>;
  lastUpdated: string | null;
}

export default function DbStats({ onClose }: DbStatsProps) {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbOperations, setDbOperations] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get database statistics
        const response = await caseStudiesApi.getStatistics();
        if (response.success) {
          setStats(response.data);
        } else {
          setError(response.error || 'Failed to load statistics');
        }

        // Get database operations stats
        const operationStats = dbMonitor.getStats();
        setDbOperations(operationStats);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 border-2 border-[#BBFF2C] border-t-transparent rounded-full animate-spin"></div>
              <span>Loading database statistics...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Database Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-2">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
              <Button onClick={() => window.location.reload()} className="flex-1">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#BBFF2C] rounded-lg flex items-center justify-center">
                <BarChart className="w-6 h-6 text-[#040725]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#040725]">Database Statistics</h2>
                <p className="text-gray-600">System performance and data insights</p>
              </div>
            </div>
            <Button onClick={onClose} variant="outline" size="sm">
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Cases</p>
                    <p className="text-2xl font-bold">{stats?.totalCases || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Homepage</p>
                    <p className="text-2xl font-bold">{stats?.homepageCases || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold">{Object.keys(stats?.categoriesBreakdown || {}).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Industries</p>
                    <p className="text-2xl font-bold">{Object.keys(stats?.industriesBreakdown || {}).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories Breakdown */}
          {stats && Object.keys(stats.categoriesBreakdown).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Categories Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.categoriesBreakdown).map(([category, count]) => (
                    <Badge key={category} variant="secondary" className="flex items-center space-x-1">
                      <span>{category}</span>
                      <span className="bg-white text-gray-700 rounded-full px-2 py-0.5 text-xs">
                        {count}
                      </span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Industries Breakdown */}
          {stats && Object.keys(stats.industriesBreakdown).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Industries Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.industriesBreakdown).map(([industry, count]) => (
                    <Badge key={industry} variant="outline" className="flex items-center space-x-1">
                      <span>{industry}</span>
                      <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                        {count}
                      </span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Database Operations */}
          {dbOperations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Operations (5 min window)</span>
                </CardTitle>
                <CardDescription>
                  Database activity and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Operations</p>
                    <p className="text-lg font-semibold">{dbOperations.totalOperations}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-lg font-semibold text-green-600">{dbOperations.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Duration</p>
                    <p className="text-lg font-semibold">{dbOperations.averageDuration}ms</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Errors</p>
                    <p className="text-lg font-semibold text-red-600">{dbOperations.errors.length}</p>
                  </div>
                </div>

                {/* Operation Types */}
                {Object.keys(dbOperations.operationsByType).length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Operations by Type:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(dbOperations.operationsByType).map(([type, count]) => (
                        <Badge key={type} variant="outline">
                          {type}: {count}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Errors */}
                {dbOperations.errors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-2">Recent Errors:</p>
                    <div className="space-y-1">
                      {dbOperations.errors.slice(0, 3).map((error: string, index: number) => (
                        <p key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Last Updated */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Last Database Update</span>
                </div>
                <span className="text-sm font-medium">
                  {formatDate(stats?.lastUpdated)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}