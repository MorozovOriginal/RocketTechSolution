import React, { useState } from 'react';
import { Settings, Database, Activity, BarChart, Users, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import SyncStatus from './SyncStatus';
import DbOperationsLog from './DbOperationsLog';
import DbStats from './DbStats';

interface AdminDashboardProps {
  iconMapping: Record<string, React.ComponentType<any>>;
  onSyncTrigger: () => void;
  isLoading?: boolean;
  caseStudiesCount: number;
  onClose: () => void;
}

export default function AdminDashboard({ 
  iconMapping, 
  onSyncTrigger, 
  isLoading, 
  caseStudiesCount,
  onClose 
}: AdminDashboardProps) {
  const [showDbStats, setShowDbStats] = useState(false);

  const quickStats = [
    { label: 'Total Cases', value: caseStudiesCount, icon: FileText, color: 'text-blue-600' },
    { label: 'Database', value: 'Connected', icon: Database, color: 'text-green-600' },
    { label: 'Last Sync', value: 'Recently', icon: Clock, color: 'text-purple-600' },
    { label: 'Status', value: 'Healthy', icon: Activity, color: 'text-green-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#BBFF2C] rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-[#040725]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#040725]">Admin Dashboard</h2>
                <p className="text-gray-600">System management and monitoring</p>
              </div>
            </div>
            <Button onClick={onClose} variant="outline" size="sm">
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-5 h-5 ${stat.color}`} />
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sync Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Database Synchronization</span>
                  </h3>
                  <SyncStatus 
                    iconMapping={iconMapping}
                    onSyncTrigger={onSyncTrigger}
                    isLoading={isLoading}
                  />
                </div>

                {/* Recent Operations */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </h3>
                  <DbOperationsLog 
                    maxOperations={6}
                    autoRefresh={true}
                    refreshInterval={3000}
                  />
                </div>
              </div>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>System Health</span>
                  </CardTitle>
                  <CardDescription>
                    Current system status and performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Database Connection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">API Endpoints</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Storage Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Sync Service</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="operations" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Extended Operations Log */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Extended Operations Log</CardTitle>
                      <CardDescription>
                        Detailed view of all database operations with performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DbOperationsLog 
                        maxOperations={10}
                        autoRefresh={true}
                        refreshInterval={2000}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-6">
              <div className="space-y-6">
                {/* Analytics Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart className="w-5 h-5" />
                        <span>Database Analytics</span>
                      </div>
                      <Button 
                        onClick={() => setShowDbStats(true)}
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Data insights and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        Click "View Details" to see comprehensive database analytics
                      </p>
                      <Badge variant="secondary">
                        Real-time data analysis available
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Database Statistics Modal */}
        {showDbStats && (
          <DbStats onClose={() => setShowDbStats(false)} />
        )}
      </div>
    </div>
  );
}