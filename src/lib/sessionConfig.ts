// Session Configuration Management
export interface SessionConfig {
  // Timeout durations in milliseconds
  timeouts: {
    default: number;      // Default session (24 hours)
    short: number;        // Short session (1 hour)
    extended: number;     // Extended session (7 days)
    rememberMe: number;   // Remember me session (30 days)
  };
  
  // Warning settings
  warnings: {
    warningTime: number;  // Show warning X minutes before expiry
    refreshInterval: number; // Check session status every X minutes
  };
  
  // Security settings
  security: {
    autoRefresh: boolean;     // Auto-refresh tokens
    forceLogoutOnExpiry: boolean; // Force logout when session expires
    clearStorageOnLogout: boolean; // Clear all storage on logout
  };
  
  // Storage settings
  storage: {
    useLocalStorage: boolean; // Use localStorage for persistence
    useSessionStorage: boolean; // Use sessionStorage for temporary sessions
    storageKey: string;      // Storage key for auth tokens
  };
}

// Default configuration
export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  timeouts: {
    default: 1000 * 60 * 60 * 24,        // 24 hours
    short: 1000 * 60 * 60,                // 1 hour
    extended: 1000 * 60 * 60 * 24 * 7,   // 7 days
    rememberMe: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
  warnings: {
    warningTime: 1000 * 60 * 5,           // 5 minutes
    refreshInterval: 1000 * 60 * 15,      // 15 minutes
  },
  security: {
    autoRefresh: true,
    forceLogoutOnExpiry: true,
    clearStorageOnLogout: true,
  },
  storage: {
    useLocalStorage: true,
    useSessionStorage: true,
    storageKey: 'supabase.auth.token',
  },
};

// Session configuration manager
export class SessionConfigManager {
  private config: SessionConfig;
  private static instance: SessionConfigManager;

  private constructor(config: SessionConfig = DEFAULT_SESSION_CONFIG) {
    this.config = { ...config };
  }

  static getInstance(config?: SessionConfig): SessionConfigManager {
    if (!SessionConfigManager.instance) {
      SessionConfigManager.instance = new SessionConfigManager(config);
    }
    return SessionConfigManager.instance;
  }

  // Get current configuration
  getConfig(): SessionConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(newConfig: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Session configuration updated:', this.config);
  }

  // Get timeout for specific session type
  getTimeout(sessionType: keyof SessionConfig['timeouts']): number {
    return this.config.timeouts[sessionType];
  }

  // Get timeout based on remember me preference
  getTimeoutForRememberMe(rememberMe: boolean): number {
    return rememberMe ? this.config.timeouts.rememberMe : this.config.timeouts.default;
  }

  // Check if session should auto-refresh
  shouldAutoRefresh(): boolean {
    return this.config.security.autoRefresh;
  }

  // Check if should force logout on expiry
  shouldForceLogoutOnExpiry(): boolean {
    return this.config.security.forceLogoutOnExpiry;
  }

  // Get warning time
  getWarningTime(): number {
    return this.config.warnings.warningTime;
  }

  // Get refresh interval
  getRefreshInterval(): number {
    return this.config.warnings.refreshInterval;
  }

  // Format duration for display
  formatDuration(ms: number): string {
    if (ms <= 0) return 'Expired';
    
    const minutes = Math.floor(ms / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  }

  // Calculate session expiry time
  calculateExpiryTime(loginTime: number, rememberMe: boolean = false): number {
    const timeout = this.getTimeoutForRememberMe(rememberMe);
    return loginTime + timeout;
  }

  // Check if session is about to expire
  isSessionExpiringSoon(expiryTime: number, bufferMinutes: number = 5): boolean {
    const now = Date.now();
    const bufferMs = bufferMinutes * 60 * 1000;
    return (expiryTime - now) <= bufferMs;
  }

  // Get time remaining until expiry
  getTimeRemaining(expiryTime: number): number {
    const now = Date.now();
    return Math.max(0, expiryTime - now);
  }
}

// Export singleton instance
export const sessionConfig = SessionConfigManager.getInstance();

// Utility functions for easy access
export const getSessionTimeout = (rememberMe: boolean = false): number => {
  return sessionConfig.getTimeoutForRememberMe(rememberMe);
};

export const getSessionWarningTime = (): number => {
  return sessionConfig.getWarningTime();
};

export const getSessionRefreshInterval = (): number => {
  return sessionConfig.getRefreshInterval();
};

export const formatSessionDuration = (ms: number): string => {
  return sessionConfig.formatDuration(ms);
}; 