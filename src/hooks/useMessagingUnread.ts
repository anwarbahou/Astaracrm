import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';

export function useMessagingUnread() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        setLoading(true);
        const count = await chatService.getTotalUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching messaging unread count:', error);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // Clean up existing subscription before creating a new one
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Subscribe to unread changes
    subscriptionRef.current = chatService.subscribeToUnreadChanges(user.id, (totalUnread) => {
      setUnreadCount(totalUnread);
    });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [user?.id]);

  return { unreadCount, loading };
} 