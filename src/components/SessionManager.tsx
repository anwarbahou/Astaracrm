import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, RefreshCw, Smartphone, Wifi, WifiOff } from 'lucide-react';

// Mobile detection utility
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 768);
};

export const SessionManager: React.FC = () => {
  const { sessionWarning, sessionExpiryTime, extendSession, getSessionTimeRemaining, loading, forceRefresh } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [mobileStuckSession, setMobileStuckSession] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Mobile stuck session detection
  useEffect(() => {
    if (isMobile() && loading) {
      const stuckTimeout = setTimeout(() => {
        setMobileStuckSession(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(stuckTimeout);
    } else {
      setMobileStuckSession(false);
    }
  }, [loading]);

  // Update time remaining every minute
  useEffect(() => {
    const updateTimeRemaining = () => {
      const remaining = getSessionTimeRemaining();
      setTimeRemaining(remaining);
      
      // Show warning when less than 10 minutes remaining
      if (remaining > 0 && remaining <= 10 * 60 * 1000) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [getSessionTimeRemaining]);

  const formatTimeRemaining = (ms: number): string => {
    if (ms <= 0) return 'Expired';
    
    const minutes = Math.floor(ms / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleExtendSession = async () => {
    try {
      await extendSession();
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };

  const handleForceRefresh = async () => {
    try {
      await forceRefresh();
      setMobileStuckSession(false);
    } catch (error) {
      console.error('Failed to force refresh:', error);
    }
  };

  const handleClearStorage = () => {
    try {
      // Clear auth-related storage
      const keysToRemove = [
        'supabase.auth.token',
        'supabase.auth.user',
        'persist',
        'user_profile_'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  };

  if (!sessionExpiryTime || timeRemaining <= 0) {
    return null;
  }

  return (
    <>
      {/* Mobile Stuck Session Recovery */}
      {mobileStuckSession && isMobile() && (
        <Alert className="fixed top-4 left-4 right-4 z-50 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <Smartphone className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mobile Session Issue</p>
                <p className="text-sm">
                  Session initialization is taking longer than expected on mobile.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleForceRefresh}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearStorage}
                  className="border-red-600 text-red-600 hover:bg-red-100"
                >
                  Reset
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Network Status Warning */}
      {!isOnline && (
        <Alert className="fixed top-4 right-4 w-80 z-50 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <WifiOff className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">No Internet Connection</p>
                <p className="text-sm">
                  Some features may not work properly.
                </p>
              </div>
              <Wifi className="h-4 w-4 text-yellow-600" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Session Warning Banner */}
      {showWarning && (
        <Alert className="fixed top-4 right-4 w-96 z-50 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Expiring Soon</p>
                <p className="text-sm">
                  Your session will expire in {formatTimeRemaining(timeRemaining)}
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleExtendSession}
                className="ml-2 bg-orange-600 hover:bg-orange-700"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Extend
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Session Status Indicator (optional - can be shown in header) */}
      {timeRemaining > 0 && timeRemaining <= 30 * 60 * 1000 && !showWarning && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWarning(true)}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Clock className="h-3 w-3 mr-1" />
            {formatTimeRemaining(timeRemaining)}
          </Button>
        </div>
      )}
    </>
  );
}; 