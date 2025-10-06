import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle } from 'lucide-react';

interface QuietHealthMonitorProps {
  className?: string;
  onStatusChange?: (isHealthy: boolean) => void;
}

export default function QuietHealthMonitor({ className = '', onStatusChange }: QuietHealthMonitorProps) {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;
    
    // Single check on mount with delay to avoid initial rush
    const performCheck = async () => {
      try {
        // Simple connectivity test without hitting API
        const isOnline = navigator.onLine;
        const hasLocalStorage = typeof localStorage !== 'undefined';
        
        // Basic environment checks
        const isHealthy = isOnline && hasLocalStorage;
        
        if (mounted) {
          setIsHealthy(isHealthy);
          setLastCheck(new Date());
          onStatusChange?.(isHealthy);
        }
      } catch (error) {
        if (mounted) {
          setIsHealthy(false);
          setLastCheck(new Date());
          onStatusChange?.(false);
        }
      }
    };

    // Delay initial check to avoid page load rush
    const timer = setTimeout(performCheck, 2000);

    // Listen for online/offline events
    const handleOnline = () => {
      if (mounted) {
        setIsHealthy(true);
        setLastCheck(new Date());
        onStatusChange?.(true);
      }
    };

    const handleOffline = () => {
      if (mounted) {
        setIsHealthy(false);
        setLastCheck(new Date());
        onStatusChange?.(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      mounted = false;
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onStatusChange]);

  if (isHealthy === null) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Database className="w-3 h-3 text-gray-400" />
        <span className="text-sm text-gray-500">Initializing...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isHealthy ? (
        <>
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-sm text-green-600">System ready</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3 text-yellow-500" />
          <span className="text-sm text-yellow-600">Limited connectivity</span>
        </>
      )}
      {lastCheck && (
        <span className="text-xs text-gray-400 ml-2">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}