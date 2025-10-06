import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { caseStudiesApi } from '../utils/caseStudiesApi';

interface ConnectionStatusProps {
  className?: string;
  compact?: boolean;
}

type ConnectionState = 'unknown' | 'connected' | 'disconnected' | 'error';

export default function ConnectionStatus({ className = '', compact = true }: ConnectionStatusProps) {
  const [status, setStatus] = useState<ConnectionState>('unknown');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only perform one initial check when component mounts
    if (!hasChecked) {
      const performInitialCheck = async () => {
        try {
          const result = await caseStudiesApi.getAllCaseStudies();
          setStatus(result.success ? 'connected' : 'disconnected');
          setLastCheck(new Date());
        } catch (error) {
          setStatus('error');
          setLastCheck(new Date());
        } finally {
          setHasChecked(true);
        }
      };

      // Add a small delay to avoid immediate API call on page load
      const timer = setTimeout(performInitialCheck, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasChecked]);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-3 h-3 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      default:
        return <Database className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Database connected';
      case 'disconnected':
        return 'Database disconnected';
      case 'error':
        return 'Connection error';
      default:
        return 'Checking connection...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'disconnected':
        return 'text-red-600';
      case 'error':
        return 'text-yellow-600';
      default:
        return 'text-gray-500';
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon()}
        <span className={`text-sm ${getStatusColor()}`}>
          {status === 'connected' ? 'Database integrated' : getStatusText()}
        </span>
        {status === 'connected' && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      {lastCheck && (
        <span className="text-xs text-gray-500">
          Last checked: {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}