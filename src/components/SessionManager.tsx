import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, RefreshCw } from 'lucide-react';

export const SessionManager: React.FC = () => {
  const { sessionWarning, sessionExpiryTime, extendSession, getSessionTimeRemaining } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);

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

  if (!sessionExpiryTime || timeRemaining <= 0) {
    return null;
  }

  return (
    <>
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