import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { notificationService, type NotificationData } from '@/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  loading: boolean;
  soundEnabled: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  refetch: () => Promise<void>;
  toggleSound: () => void;
  testSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    // Get sound preference from localStorage, default to true
    const saved = localStorage.getItem('notification_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/notificationsound.mp3');
    audioRef.current.preload = 'auto';
    audioRef.current.volume = 0.7; // Set volume to 70%
    
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  // Function to play notification sound
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      if (audioRef.current) {
        // Reset audio to beginning in case it's already playing
        audioRef.current.currentTime = 0;
        
        // Play the sound
        const playPromise = audioRef.current.play();
        
        // Handle the promise to avoid unhandled rejection warnings
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('🔊 Notification sound played successfully');
            })
            .catch((error) => {
              console.warn('⚠️ Could not play notification sound:', error);
              // This is common when user hasn't interacted with the page yet
            });
        }
      }
    } catch (error) {
      console.warn('⚠️ Error playing notification sound:', error);
    }
  }, [soundEnabled]);

  // Toggle sound setting
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('notification_sound_enabled', JSON.stringify(newValue));
      console.log('🔊 Notification sound', newValue ? 'enabled' : 'disabled');
      return newValue;
    });
  }, []);

  // Test sound function
  const testSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      console.log('🔊 Testing notification sound...');
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('🔊 Test sound played successfully');
          })
          .catch((error) => {
            console.warn('⚠️ Could not play test sound:', error);
          });
      }
    }
  }, [soundEnabled]);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Fetching notifications for user:', user.id);
      
      const [notificationsData, unreadCountData] = await Promise.all([
        notificationService.getNotificationsForUser(user.id),
        notificationService.getUnreadCount(user.id)
      ]);
      
      console.log('📥 Fetched', notificationsData.length, 'notifications, unread:', unreadCountData);
      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      // Fallback to empty state instead of infinite loading
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state optimistically
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      await notificationService.markAllAsRead(user.id);
      
      // Update local state optimistically
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user?.id]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    if (!user?.id) return;

    try {
      await notificationService.clearAllForUser(user.id);
      
      // Update local state optimistically
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  }, [user?.id]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      // Clean up any existing channel
      if (channel) {
        supabase.removeChannel(channel);
        setChannel(null);
      }
      return;
    }

    // Fetch initial data
    fetchNotifications();

    // Clean up any existing channel before creating a new one
    if (channel) {
      supabase.removeChannel(channel);
    }

    // Set up real-time subscription for new notifications
    const notificationChannel = supabase
      .channel(`notifications_${user.id}`) // Unique channel name per user
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `target_user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('New notification received:', payload);
          const newNotification = payload.new as NotificationData;
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Play notification sound for new notifications
          playNotificationSound();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `target_user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Notification updated:', payload);
          const updatedNotification = payload.new as NotificationData;
          
          setNotifications(prev => 
            prev.map(notif => 
              notif.id === updatedNotification.id 
                ? updatedNotification 
                : notif
            )
          );
          
          // Update unread count if read status changed
          if (payload.old && payload.new) {
            const oldNotif = payload.old as NotificationData;
            const newNotif = payload.new as NotificationData;
            
            if (!oldNotif.is_read && newNotif.is_read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            } else if (oldNotif.is_read && !newNotif.is_read) {
              setUnreadCount(prev => prev + 1);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `target_user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Notification deleted:', payload);
          const deletedNotification = payload.old as NotificationData;
          
          setNotifications(prev => 
            prev.filter(notif => notif.id !== deletedNotification.id)
          );
          
          if (!deletedNotification.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    setChannel(notificationChannel);

    // Cleanup subscription on unmount or user change
    return () => {
      if (notificationChannel) {
        supabase.removeChannel(notificationChannel);
      }
    };
  }, [user?.id, fetchNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    soundEnabled,
    markAsRead,
    markAllAsRead,
    clearAll,
    refetch: fetchNotifications,
    toggleSound,
    testSound,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 