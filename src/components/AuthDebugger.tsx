import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const AuthDebugger: React.FC = () => {
  const { user, userProfile, session, loading, error, sessionWarning, sessionExpiryTime } = useAuth();

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <div>User: {user ? '✅' : '❌'}</div>
        <div>Profile: {userProfile ? '✅' : '❌'}</div>
        <div>Session: {session ? '✅' : '❌'}</div>
        <div>Loading: {loading ? '🔄' : '✅'}</div>
        <div>Error: {error ? '❌' : '✅'}</div>
        <div>Warning: {sessionWarning ? '⚠️' : '✅'}</div>
        <div>Expiry: {sessionExpiryTime ? new Date(sessionExpiryTime).toLocaleTimeString() : 'N/A'}</div>
        {userProfile && (
          <div>Role: {userProfile.role || 'none'}</div>
        )}
      </div>
    </div>
  );
}; 