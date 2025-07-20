# Session Management System

## Overview

The Astara CRM application uses a comprehensive session management system built on Supabase authentication with custom timeout handling and user-friendly warnings.

## Current Session Durations

### **Default Session Configuration:**

| Session Type | Duration | Use Case |
|--------------|----------|----------|
| **Default Session** | 24 hours | Standard user sessions |
| **Short Session** | 1 hour | Sensitive operations, admin tasks |
| **Extended Session** | 7 days | Trusted devices, long-term work |
| **Remember Me** | 30 days | Persistent login across browser restarts |

### **Warning System:**
- **Warning Time:** 5 minutes before expiry
- **Refresh Interval:** 15 minutes (auto-refresh check)
- **Auto-refresh:** Enabled by default

## How to Modify Session Durations

### **Option 1: Modify Configuration Constants**

Edit `src/contexts/AuthContext.tsx`:

```typescript
const SESSION_CONFIG = {
  // Default session timeout (24 hours)
  DEFAULT_TIMEOUT: 1000 * 60 * 60 * 24,
  
  // Short session timeout (1 hour) - for sensitive operations
  SHORT_TIMEOUT: 1000 * 60 * 60,
  
  // Extended session timeout (7 days) - for trusted devices
  EXTENDED_TIMEOUT: 1000 * 60 * 60 * 24 * 7,
  
  // Session timeout for "Remember Me" (30 days)
  REMEMBER_ME_TIMEOUT: 1000 * 60 * 60 * 24 * 30,
  
  // Warning time before session expires (5 minutes)
  WARNING_TIME: 1000 * 60 * 5,
  
  // Auto-refresh interval (15 minutes)
  REFRESH_INTERVAL: 1000 * 60 * 15
};
```

### **Option 2: Use Session Configuration Manager**

Edit `src/lib/sessionConfig.ts`:

```typescript
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
  // ... other settings
};
```

### **Option 3: Runtime Configuration**

Update session configuration at runtime:

```typescript
import { sessionConfig } from '@/lib/sessionConfig';

// Update specific timeout
sessionConfig.updateConfig({
  timeouts: {
    default: 1000 * 60 * 60 * 12, // 12 hours
    rememberMe: 1000 * 60 * 60 * 24 * 14, // 14 days
  }
});
```

## Session Management Features

### **1. Automatic Token Refresh**
- Supabase automatically refreshes JWT tokens before expiry
- Custom refresh logic handles edge cases
- Graceful fallback to login on refresh failure

### **2. Session Warning System**
- Shows warning 5 minutes before session expiry
- User can extend session with one click
- Visual indicators for session status

### **3. Storage Management**
- **localStorage:** Used for "Remember Me" sessions
- **sessionStorage:** Used for temporary sessions
- Automatic cleanup on logout

### **4. Security Features**
- Force logout on session expiry
- Clear all storage on logout
- Session validation on each request

## Implementation Details

### **Session Monitoring**

The system monitors sessions through:

1. **Periodic Checks:** Every 15 minutes
2. **Warning System:** 5 minutes before expiry
3. **Auto-refresh:** Before token expiry
4. **Context Loss Handling:** WebGL and other errors

### **Storage Strategy**

```typescript
const customStorage = {
  getItem: (key: string): string | null => {
    // Prefer localStorage for persistent sessions
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    // Session persistence based on 'persist' flag
    if (sessionStorage.getItem('persist') === 'true') {
      localStorage.setItem(key, value);
    }
    sessionStorage.setItem(key, value);
  }
};
```

### **Session State Management**

```typescript
interface AuthContextType {
  // ... other properties
  sessionWarning: boolean;
  sessionExpiryTime: number | null;
  extendSession: () => Promise<void>;
  getSessionTimeRemaining: () => number;
}
```

## Common Modifications

### **Shorten Session Duration**

```typescript
// For high-security environments
sessionConfig.updateConfig({
  timeouts: {
    default: 1000 * 60 * 60 * 4, // 4 hours
    short: 1000 * 60 * 30,        // 30 minutes
    rememberMe: 1000 * 60 * 60 * 24 * 7, // 7 days
  }
});
```

### **Extend Session Duration**

```typescript
// For trusted environments
sessionConfig.updateConfig({
  timeouts: {
    default: 1000 * 60 * 60 * 24 * 3, // 3 days
    rememberMe: 1000 * 60 * 60 * 24 * 90, // 90 days
  }
});
```

### **Disable Auto-refresh**

```typescript
sessionConfig.updateConfig({
  security: {
    autoRefresh: false,
    forceLogoutOnExpiry: true,
  }
});
```

### **Custom Warning Times**

```typescript
sessionConfig.updateConfig({
  warnings: {
    warningTime: 1000 * 60 * 10, // 10 minutes
    refreshInterval: 1000 * 60 * 30, // 30 minutes
  }
});
```

## Environment-Specific Configurations

### **Development Environment**
```typescript
if (import.meta.env.DEV) {
  sessionConfig.updateConfig({
    timeouts: {
      default: 1000 * 60 * 60 * 24 * 7, // 7 days for development
    }
  });
}
```

### **Production Environment**
```typescript
if (import.meta.env.PROD) {
  sessionConfig.updateConfig({
    security: {
      forceLogoutOnExpiry: true,
      clearStorageOnLogout: true,
    }
  });
}
```

## Troubleshooting

### **Session Expires Too Quickly**
1. Check if "Remember Me" is enabled
2. Verify localStorage is available
3. Check browser privacy settings
4. Review session configuration

### **Session Doesn't Expire**
1. Verify auto-refresh is working
2. Check token refresh logic
3. Review session monitoring intervals

### **Warning Not Showing**
1. Check warning time configuration
2. Verify session expiry calculation
3. Review SessionManager component

## Best Practices

1. **Security:** Use shorter sessions for sensitive operations
2. **UX:** Provide clear warnings before session expiry
3. **Performance:** Use appropriate refresh intervals
4. **Storage:** Clear sensitive data on logout
5. **Monitoring:** Log session events for debugging

## API Reference

### **SessionConfigManager Methods**

- `getTimeout(sessionType)`: Get timeout for session type
- `getTimeoutForRememberMe(rememberMe)`: Get timeout based on remember me
- `updateConfig(newConfig)`: Update configuration
- `formatDuration(ms)`: Format duration for display
- `isSessionExpiringSoon(expiryTime)`: Check if session expiring soon

### **AuthContext Methods**

- `extendSession()`: Extend current session
- `getSessionTimeRemaining()`: Get time remaining
- `sessionWarning`: Boolean indicating warning state
- `sessionExpiryTime`: Timestamp of session expiry 