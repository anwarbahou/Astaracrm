import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { calendarService, type CalendarEvent, type CreateCalendarEventInput, type CalendarFilters } from '@/services/calendarService';
import { useTranslation } from 'react-i18next';

export function useCalendarEvents(filters?: CalendarFilters) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  const {
    data: events = [],
    isLoading,
    error,
    refetch
  } = useQuery<CalendarEvent[]>({
    queryKey: ['calendar-events', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return calendarService.getEvents(filters);
    },
    enabled: !!user?.id
  });

  const createEventMutation = useMutation({
    mutationFn: async (newEvent: CreateCalendarEventInput) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return calendarService.createEvent(newEvent);
    },
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast({
        title: t('calendar.createEvent.toast.successTitle'),
        description: t('calendar.createEvent.toast.successDescription', { title: event.title }),
      });
    },
    onError: (error: Error) => {
      console.error('Calendar event creation failed:', error);
      toast({
        title: t('calendar.createEvent.toast.errorTitle'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<CreateCalendarEventInput>) => {
      return calendarService.updateEvent(id, updates);
    },
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast({
        title: t('calendar.updateEvent.toast.successTitle'),
        description: t('calendar.updateEvent.toast.successDescription', { title: event.title }),
      });
    },
    onError: (error: Error) => {
      console.error('Calendar event update failed:', error);
      toast({
        title: t('calendar.updateEvent.toast.errorTitle'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return calendarService.deleteEvent(eventId);
    },
    onMutate: async (eventId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['calendar-events'] });

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData<CalendarEvent[]>(['calendar-events']);

      // Optimistically update to the new value
      queryClient.setQueryData<CalendarEvent[]>(['calendar-events'], old => {
        return old?.filter(event => event.id !== eventId) ?? [];
      });

      // Return a context object with the snapshotted value
      return { previousEvents };
    },
    onError: (error: Error, eventId, context) => {
      // Rollback to the previous value
      queryClient.setQueryData(['calendar-events'], context?.previousEvents);

      toast({
        title: t('calendar.deleteEvent.toast.errorTitle'),
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: (_, eventId) => {
      toast({
        title: t('calendar.deleteEvent.toast.successTitle'),
        description: t('calendar.deleteEvent.toast.successDescription'),
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
  });

  const searchEventsMutation = useMutation({
    mutationFn: async (searchTerm: string) => {
      return calendarService.searchEvents(searchTerm);
    },
  });

  const getUpcomingEvents = async () => {
    return calendarService.getUpcomingEvents();
  };

  const getTodayEvents = async () => {
    return calendarService.getTodayEvents();
  };

  const getEventsByDateRange = async (startDate: string, endDate: string) => {
    return calendarService.getEventsByDateRange(startDate, endDate);
  };

  const getEventsByClient = async (clientId: string) => {
    return calendarService.getEventsByClient(clientId);
  };

  const getEventsByContact = async (contactId: string) => {
    return calendarService.getEventsByContact(contactId);
  };

  const getEventsByDeal = async (dealId: string) => {
    return calendarService.getEventsByDeal(dealId);
  };

  return {
    events,
    isLoading,
    error,
    refetch,
    createEvent: createEventMutation.mutate,
    createEventAsync: createEventMutation.mutateAsync,
    updateEvent: updateEventMutation.mutate,
    updateEventAsync: updateEventMutation.mutateAsync,
    deleteEvent: deleteEventMutation.mutate,
    deleteEventAsync: deleteEventMutation.mutateAsync,
    searchEvents: searchEventsMutation.mutate,
    searchEventsAsync: searchEventsMutation.mutateAsync,
    getUpcomingEvents,
    getTodayEvents,
    getEventsByDateRange,
    getEventsByClient,
    getEventsByContact,
    getEventsByDeal,
  };
}

// Hook for a single calendar event
export function useCalendarEvent(eventId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  const {
    data: event,
    isLoading,
    error,
    refetch
  } = useQuery<CalendarEvent | null>({
    queryKey: ['calendar-event', eventId, user?.id],
    queryFn: async () => {
      if (!user?.id || !eventId) {
        return null;
      }
      return calendarService.getEvent(eventId);
    },
    enabled: !!user?.id && !!eventId
  });

  return {
    event,
    isLoading,
    error,
    refetch,
  };
}

// Hook for upcoming events
export function useUpcomingEvents() {
  const { user } = useAuth();

  const {
    data: events = [],
    isLoading,
    error,
    refetch
  } = useQuery<CalendarEvent[]>({
    queryKey: ['upcoming-events', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return calendarService.getUpcomingEvents();
    },
    enabled: !!user?.id
  });

  return {
    events,
    isLoading,
    error,
    refetch,
  };
}

// Hook for today's events
export function useTodayEvents() {
  const { user } = useAuth();

  const {
    data: events = [],
    isLoading,
    error,
    refetch
  } = useQuery<CalendarEvent[]>({
    queryKey: ['today-events', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return calendarService.getTodayEvents();
    },
    enabled: !!user?.id
  });

  return {
    events,
    isLoading,
    error,
    refetch,
  };
} 