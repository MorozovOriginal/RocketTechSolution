import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StatusNotificationProps {
  className?: string;
}

export default function StatusNotification({ className = '' }: StatusNotificationProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [lastStatusChange, setLastStatusChange] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastStatusChange(new Date());
      setShowNotification(true);
      
      // Auto-hide after 3 seconds
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastStatusChange(new Date());
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusIcon = () => {
    if (isOnline) {
      return <Wifi className="w-4 h-4 text-green-500" />;
    } else {
      return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    return isOnline ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    return isOnline ? 'Подключение восстановлено' : 'Нет подключения к интернету';
  };

  return (
    <>
      {/* Persistent status indicator */}
      {null}

      {/* Sliding notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-20 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isOnline ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {getStatusIcon()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">
                  {getStatusText()}
                </p>
                {lastStatusChange && (
                  <p className="text-xs text-gray-500">
                    {lastStatusChange.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}