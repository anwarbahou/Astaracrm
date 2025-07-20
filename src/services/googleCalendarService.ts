import { supabase } from '@/integrations/supabase/client';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'];

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

interface DatabaseEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day?: boolean;
  location?: string;
  attendees?: string[];
  tags?: string[];
  status?: string;
  google_event_id?: string;
  owner_id: string;
}

export class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private accessToken: string | null = null;

  constructor() {
    // Restore access token from localStorage on initialization
    this.accessToken = localStorage.getItem('google_calendar_access_token');
    console.log('GoogleCalendarService initialized, accessToken:', !!this.accessToken);
  }

  static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  async authenticate(): Promise<boolean> {
    return new Promise((resolve) => {
      // Get the current origin for the redirect URI
      const currentOrigin = window.location.origin;
      const redirectUri = `${currentOrigin}/google-oauth-callback.html`;
      
      console.log('Using redirect URI:', redirectUri);
      console.log('Google Client ID:', GOOGLE_CLIENT_ID);
      
      if (!GOOGLE_CLIENT_ID) {
        console.error('Google Client ID is not configured');
        resolve(false);
        return;
      }
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(GOOGLE_SCOPES.join(' '))}&` +
        `response_type=token&` +
        `state=${encodeURIComponent(JSON.stringify({ timestamp: Date.now() }))}`;
      
      console.log('Auth URL:', authUrl);
      
      // Store current session info to restore later
      const currentSession = localStorage.getItem('supabase.auth.token');
      const currentUser = localStorage.getItem('supabase.auth.user');
      
      // Open in popup window
      const authWindow = window.open(
        authUrl,
        'googleAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes,status=yes'
      );

      if (!authWindow) {
        console.error('Popup blocked by browser');
        resolve(false);
        return;
      }

      // Listen for messages from the popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          this.accessToken = event.data.accessToken;
          // Persist the access token
          localStorage.setItem('google_calendar_access_token', this.accessToken);
          console.log('Google authentication successful');
          
          // Restore Supabase session if it was lost
          this.restoreSupabaseSession(currentSession, currentUser);
          
          window.removeEventListener('message', messageHandler);
          resolve(true);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          console.error('Google authentication error:', event.data.error);
          
          // Restore Supabase session if it was lost
          this.restoreSupabaseSession(currentSession, currentUser);
          
          window.removeEventListener('message', messageHandler);
          resolve(false);
        }
      };

      window.addEventListener('message', messageHandler);

      // Timeout after 5 minutes
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        console.log('Authentication timeout');
        resolve(false);
      }, 300000);
    });
  }

  private restoreSupabaseSession(sessionToken: string | null, userToken: string | null) {
    try {
      // Restore session if it was lost
      if (sessionToken && !localStorage.getItem('supabase.auth.token')) {
        localStorage.setItem('supabase.auth.token', sessionToken);
      }
      
      if (userToken && !localStorage.getItem('supabase.auth.user')) {
        localStorage.setItem('supabase.auth.user', userToken);
      }
      
      // Force a session refresh
      supabase.auth.refreshSession().then(({ data, error }) => {
        if (error) {
          console.error('Failed to refresh session:', error);
        } else if (data.session) {
          console.log('Session restored successfully');
        }
      });
    } catch (error) {
      console.error('Error restoring session:', error);
    }
  }

  async syncEvents(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      // Check if user is authenticated with Supabase first
      let { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        // Try to refresh the session
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (!refreshData.session) {
          return { success: false, message: 'User not authenticated with Supabase. Please log in again.' };
        }
        currentUser = { user: refreshData.user };
      }

      console.log('User authenticated:', currentUser.user.email);

      if (!this.accessToken) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          return { success: false, message: 'Google authentication failed. Please check your Google OAuth configuration.' };
        }
      }

      // Double-check session after OAuth
      const { data: userCheck } = await supabase.auth.getUser();
      if (!userCheck.user) {
        return { success: false, message: 'Session lost during authentication. Please log in again.' };
      }

      console.log('Fetching events from Google Calendar...');

      // Fetch events from Google Calendar
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
        'timeMin=' + encodeURIComponent(new Date().toISOString()) +
        '&timeMax=' + encodeURIComponent(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()) +
        '&singleEvents=true&orderBy=startTime',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google API error:', response.status, errorText);
        throw new Error(`Google API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const events = data.items || [];

      console.log(`Found ${events.length} events from Google Calendar`);

      // Transform and save events to Supabase
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { success: false, message: 'User not authenticated' };
      }

      let syncedCount = 0;
      for (const event of events) {
        const transformedEvent = this.transformGoogleEvent(event, user.user.id);
        
        const { error } = await supabase
          .from('calendar_events')
          .upsert(transformedEvent, { onConflict: 'google_event_id' });

        if (!error) {
          syncedCount++;
        } else {
          console.error('Error syncing event:', error);
        }
      }

      return { 
        success: true, 
        message: `Successfully synced ${syncedCount} events from Google Calendar`,
        count: syncedCount
      };

    } catch (error) {
      console.error('Google Calendar sync error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Sync failed' 
      };
    }
  }

  async syncToGoogle(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      // Check if user is authenticated with Supabase first
      let { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (!refreshData.session) {
          return { success: false, message: 'User not authenticated with Supabase. Please log in again.' };
        }
        currentUser = { user: refreshData.user };
      }

      if (!this.accessToken) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          return { success: false, message: 'Google authentication failed. Please check your Google OAuth configuration.' };
        }
      }

      console.log('Fetching events from database...');

      // Fetch events from database that don't have a Google event ID
      const { data: events, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('owner_id', currentUser.user.id)
        .is('google_event_id', null)
        .gte('start_time', new Date().toISOString());

      if (error) {
        console.error('Error fetching events from database:', error);
        return { success: false, message: 'Failed to fetch events from database' };
      }

      console.log(`Found ${events.length} events to sync to Google Calendar`);

      let syncedCount = 0;
      for (const event of events) {
        try {
          const googleEvent = this.transformDatabaseEvent(event);
          
          const response = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(googleEvent),
            }
          );

          if (response.ok) {
            const createdEvent = await response.json();
            
            // Update the database event with the Google event ID
            const { error: updateError } = await supabase
              .from('calendar_events')
              .update({ google_event_id: createdEvent.id })
              .eq('id', event.id);

            if (!updateError) {
              syncedCount++;
              console.log(`Synced event: ${event.title}`);
            } else {
              console.error('Error updating event with Google ID:', updateError);
            }
          } else {
            const errorText = await response.text();
            console.error(`Failed to create Google event for: ${event.title}`, errorText);
          }
        } catch (error) {
          console.error(`Error syncing event ${event.title}:`, error);
        }
      }

      return { 
        success: true, 
        message: `Successfully synced ${syncedCount} events to Google Calendar`,
        count: syncedCount
      };

    } catch (error) {
      console.error('Database to Google sync error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Sync failed' 
      };
    }
  }

  async bidirectionalSync(): Promise<{ success: boolean; message: string; fromGoogle?: number; toGoogle?: number }> {
    try {
      console.log('Starting bidirectional sync...');

      // Sync from Google to Database
      const fromGoogleResult = await this.syncEvents();
      
      // Sync from Database to Google
      const toGoogleResult = await this.syncToGoogle();

      const message = [
        fromGoogleResult.success ? `Imported ${fromGoogleResult.count || 0} events from Google` : 'Failed to import from Google',
        toGoogleResult.success ? `Exported ${toGoogleResult.count || 0} events to Google` : 'Failed to export to Google'
      ].join('. ');

      return {
        success: fromGoogleResult.success || toGoogleResult.success,
        message,
        fromGoogle: fromGoogleResult.count,
        toGoogle: toGoogleResult.count
      };

    } catch (error) {
      console.error('Bidirectional sync error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Bidirectional sync failed' 
      };
    }
  }

  private transformGoogleEvent(googleEvent: GoogleCalendarEvent, userId: string) {
    return {
      title: googleEvent.summary,
      description: googleEvent.description || '',
      start_time: googleEvent.start.dateTime || googleEvent.start.date,
      end_time: googleEvent.end.dateTime || googleEvent.end.date,
      location: '',
      attendees: googleEvent.attendees?.map(a => a.email) || [],
      visibility: 'public',
      recurrence_rule: null,
      owner_id: userId,
      google_event_id: googleEvent.id,
      is_all_day: !googleEvent.start.dateTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private transformDatabaseEvent(event: DatabaseEvent) {
    const googleEvent: any = {
      summary: event.title,
      description: event.description || '',
      start: {
        dateTime: event.start_time,
        timeZone: 'UTC'
      },
      end: {
        dateTime: event.end_time,
        timeZone: 'UTC'
      }
    };

    // Add location if available
    if (event.location) {
      googleEvent.location = event.location;
    }

    // Add attendees if available
    if (event.attendees && event.attendees.length > 0) {
      googleEvent.attendees = event.attendees.map(email => ({ email }));
    }

    // Add description with tags if available
    if (event.tags && event.tags.length > 0) {
      const tagsText = event.tags.join(', ');
      googleEvent.description = event.description 
        ? `${event.description}\n\nTags: ${tagsText}`
        : `Tags: ${tagsText}`;
    }

    return googleEvent;
  }

  isAuthenticated(): boolean {
    const hasToken = !!this.accessToken;
    console.log('isAuthenticated called, hasToken:', hasToken);
    return hasToken;
  }

  async validateToken(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    try {
      // Test the token by making a simple API call
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // Token is invalid, clear it
        this.clearAuth();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this.clearAuth();
      return false;
    }
  }

  clearAuth(): void {
    this.accessToken = null;
    localStorage.removeItem('google_calendar_access_token');
  }
}

export const googleCalendarService = GoogleCalendarService.getInstance(); 