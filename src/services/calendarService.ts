import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day?: boolean;
  location?: string;
  attendees?: string[];
  attendee_users?: Array<{
    email: string;
    name: string;
    avatar_url?: string;
    id: string;
  }>;
  client_id?: string;
  contact_id?: string;
  deal_id?: string;
  reminder_minutes?: number;
  is_recurring?: boolean;
  recurrence_rule?: string;
  tags?: string[];
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  visibility?: 'public' | 'private';
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
  // Additional fields for UI
  client_name?: string;
  contact_name?: string;
  deal_name?: string;
  owner_name?: string;
}

export interface CreateCalendarEventInput {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day?: boolean;
  location?: string;
  attendees?: string[];
  client_id?: string;
  contact_id?: string;
  deal_id?: string;
  reminder_minutes?: number;
  is_recurring?: boolean;
  recurrence_rule?: string;
  tags?: string[];
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  visibility?: 'public' | 'private';
}

export interface UpdateCalendarEventInput extends Partial<CreateCalendarEventInput> {
  id: string;
}

export interface CalendarFilters {
  start_date?: string;
  end_date?: string;
  client_id?: string;
  contact_id?: string;
  deal_id?: string;
  status?: string;
  tags?: string[];
}

class CalendarService {
  /**
   * Get calendar events with optional filters
   */
  async getEvents(filters?: CalendarFilters): Promise<CalendarEvent[]> {
    try {
      let query = supabase
        .from('calendar_events')
        .select(`
          *,
          clients:client_id(name),
          contacts:contact_id(first_name, last_name),
          deals:deal_id(name),
          users:owner_id(first_name, last_name)
        `)
        .order('start_time', { ascending: true });

      // Apply filters
      if (filters?.start_date) {
        query = query.gte('start_time', filters.start_date);
      }
      if (filters?.end_date) {
        query = query.lte('end_time', filters.end_date);
      }
      if (filters?.client_id) {
        query = query.eq('client_id', filters.client_id);
      }
      if (filters?.contact_id) {
        query = query.eq('contact_id', filters.contact_id);
      }
      if (filters?.deal_id) {
        query = query.eq('deal_id', filters.deal_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching calendar events:', error);
        throw new Error(error.message);
      }

      // Transform the data to include related entity names and fetch attendee user data
      const eventsWithAttendees = await Promise.all(
        data?.map(async (event) => {
          // Fetch user data for attendees
          let attendeeUsers = [];
          if (event.attendees && event.attendees.length > 0) {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, email, first_name, last_name, avatar_url')
              .in('email', event.attendees)
              .eq('status', 'active');

            if (!userError && userData) {
              attendeeUsers = userData.map(user => ({
                id: user.id,
                email: user.email,
                name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email,
                avatar_url: user.avatar_url
              }));
            }
          }

          return {
            ...event,
            client_name: event.clients?.name,
            contact_name: event.contacts ? `${event.contacts.first_name} ${event.contacts.last_name}`.trim() : null,
            deal_name: event.deals?.name,
            owner_name: event.users ? `${event.users.first_name} ${event.users.last_name}`.trim() : null,
            attendee_users: attendeeUsers,
          };
        }) || []
      );

      return eventsWithAttendees;
    } catch (error) {
      console.error('Calendar service error:', error);
      throw error;
    }
  }

  /**
   * Get a single calendar event by ID
   */
  async getEvent(id: string): Promise<CalendarEvent | null> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select(`
          *,
          clients:client_id(name),
          contacts:contact_id(first_name, last_name),
          deals:deal_id(name),
          users:owner_id(first_name, last_name)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching calendar event:', error);
        throw new Error(error.message);
      }

      if (!data) return null;

      // Fetch user data for attendees
      let attendeeUsers = [];
      if (data.attendees && data.attendees.length > 0) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, avatar_url')
          .in('email', data.attendees)
          .eq('status', 'active');

        if (!userError && userData) {
          attendeeUsers = userData.map(user => ({
            id: user.id,
            email: user.email,
            name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email,
            avatar_url: user.avatar_url
          }));
        }
      }

      return {
        ...data,
        client_name: data.clients?.name,
        contact_name: data.contacts ? `${data.contacts.first_name} ${data.contacts.last_name}`.trim() : null,
        deal_name: data.deals?.name,
        owner_name: data.users ? `${data.users.first_name} ${data.users.last_name}`.trim() : null,
        attendee_users: attendeeUsers,
      };
    } catch (error) {
      console.error('Calendar service error:', error);
      throw error;
    }
  }

  /**
   * Create a new calendar event
   */
  async createEvent(eventData: CreateCalendarEventInput): Promise<CalendarEvent[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Ensure the event is created with the current user as owner
      const eventWithOwner = {
        ...eventData,
        owner_id: user.id
      };

      let eventsToCreate = [eventWithOwner];

      // If this is a recurring event, generate all occurrences
      if (eventData.is_recurring && eventData.recurrence_rule) {
        const { generateSimpleRecurringEvents } = await import('@/utils/recurrenceUtils');
        
        // Parse the frequency from the recurrence rule
        const frequency = eventData.recurrence_rule.includes('DAILY') ? 'daily' :
                        eventData.recurrence_rule.includes('WEEKLY') ? 'weekly' :
                        eventData.recurrence_rule.includes('MONTHLY') ? 'monthly' :
                        eventData.recurrence_rule.includes('YEARLY') ? 'yearly' : 'weekly';
        
        const recurringEvents = generateSimpleRecurringEvents(eventWithOwner, frequency, 10); // Generate 10 occurrences
        eventsToCreate = recurringEvents.map(event => ({
          ...event,
          owner_id: user.id
        }));
      }

      // Insert all events
      const { data, error } = await supabase
        .from('calendar_events')
        .insert(eventsToCreate)
        .select();

      if (error) {
        console.error('Error creating calendar events:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Calendar service error:', error);
      throw error;
    }
  }

  /**
   * Update an existing calendar event
   */
  async updateEvent(id: string, eventData: Partial<CreateCalendarEventInput>): Promise<CalendarEvent> {
    try {
      // Get current user to verify ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First, get the event to check ownership
      const { data: existingEvent, error: fetchError } = await supabase
        .from('calendar_events')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching event for ownership check:', fetchError);
        throw new Error('Event not found');
      }

      if (existingEvent.owner_id !== user.id) {
        throw new Error('You can only update events you created');
      }

      // Remove owner_id from update data to prevent ownership transfer
      const { owner_id, ...updateData } = eventData as any;

      const { data, error } = await supabase
        .from('calendar_events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating calendar event:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Calendar service error:', error);
      throw error;
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(id: string): Promise<void> {
    try {
      // Get current user to verify ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First, get the event to check ownership
      const { data: existingEvent, error: fetchError } = await supabase
        .from('calendar_events')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching event for ownership check:', fetchError);
        throw new Error('Event not found');
      }

      if (existingEvent.owner_id !== user.id) {
        throw new Error('You can only delete events you created');
      }

      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting calendar event:', error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Calendar service error:', error);
      throw error;
    }
  }

  /**
   * Get events for a specific date range
   */
  async getEventsByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    return this.getEvents({
      start_date: startDate,
      end_date: endDate,
    });
  }

  /**
   * Get events for a specific client
   */
  async getEventsByClient(clientId: string): Promise<CalendarEvent[]> {
    return this.getEvents({
      client_id: clientId,
    });
  }

  /**
   * Get events for a specific contact
   */
  async getEventsByContact(contactId: string): Promise<CalendarEvent[]> {
    return this.getEvents({
      contact_id: contactId,
    });
  }

  /**
   * Get events for a specific deal
   */
  async getEventsByDeal(dealId: string): Promise<CalendarEvent[]> {
    return this.getEvents({
      deal_id: dealId,
    });
  }

  /**
   * Get upcoming events (next 7 days)
   */
  async getUpcomingEvents(): Promise<CalendarEvent[]> {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.getEvents({
      start_date: now.toISOString(),
      end_date: nextWeek.toISOString(),
    });
  }

  /**
   * Get today's events
   */
  async getTodayEvents(): Promise<CalendarEvent[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return this.getEvents({
      start_date: startOfDay.toISOString(),
      end_date: endOfDay.toISOString(),
    });
  }

  /**
   * Search events by title or description
   */
  async searchEvents(searchTerm: string): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select(`
          *,
          clients:client_id(name),
          contacts:contact_id(first_name, last_name),
          deals:deal_id(name),
          users:owner_id(first_name, last_name)
        `)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error searching calendar events:', error);
        throw new Error(error.message);
      }

      return data?.map(event => ({
        ...event,
        client_name: event.clients?.name,
        contact_name: event.contacts ? `${event.contacts.first_name} ${event.contacts.last_name}`.trim() : null,
        deal_name: event.deals?.name,
        owner_name: event.users ? `${event.users.first_name} ${event.users.last_name}`.trim() : null,
      })) || [];
    } catch (error) {
      console.error('Calendar service error:', error);
      throw error;
    }
  }
}

export const calendarService = new CalendarService(); 