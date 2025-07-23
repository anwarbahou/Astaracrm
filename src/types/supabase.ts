export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      calendar_events: {
        Row: {
          all_day: boolean | null
          attendees: Json | null
          client_id: string | null
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          description: string | null
          end_time: string
          google_event_id: string | null
          id: string
          is_recurring: boolean | null
          location: string | null
          owner_id: string | null
          recurrence_rule: string | null
          reminder_minutes: number | null
          start_time: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          all_day?: boolean | null
          attendees?: Json | null
          client_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          end_time: string
          google_event_id?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          owner_id?: string | null
          recurrence_rule?: string | null
          reminder_minutes?: number | null
          start_time: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          all_day?: boolean | null
          attendees?: Json | null
          client_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          end_time?: string
          google_event_id?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          owner_id?: string | null
          recurrence_rule?: string | null
          reminder_minutes?: number | null
          start_time?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_members: {
        Row: {
          channel_id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_members_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_private: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_private?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          avatar_url: string | null
          contacts_count: number | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          industry: string | null
          name: string
          notes: string | null
          owner_earnings: number | null
          owner_id: string | null
          owner_percentage: number | null
          phone: string | null
          stage: Database["public"]["Enums"]["client_stage"] | null
          status: Database["public"]["Enums"]["user_status"] | null
          subowner_earnings: number | null
          subowner_id: string | null
          subowner_percentage: number | null
          tags: string[] | null
          total_deal_value: number | null
          total_earnings: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          contacts_count?: number | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          owner_earnings?: number | null
          owner_id?: string | null
          owner_percentage?: number | null
          phone?: string | null
          stage?: Database["public"]["Enums"]["client_stage"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          subowner_earnings?: number | null
          subowner_id?: string | null
          subowner_percentage?: number | null
          tags?: string[] | null
          total_deal_value?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          contacts_count?: number | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          owner_earnings?: number | null
          owner_id?: string | null
          owner_percentage?: number | null
          phone?: string | null
          stage?: Database["public"]["Enums"]["client_stage"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          subowner_earnings?: number | null
          subowner_id?: string | null
          subowner_percentage?: number | null
          tags?: string[] | null
          total_deal_value?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_subowner_id_fkey"
            columns: ["subowner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          avatar_url: string | null
          client_id: string | null
          company: string | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_contacted_at: string | null
          last_name: string
          linkedin_url: string | null
          notes: string | null
          owner_id: string | null
          phone: string | null
          role: string | null
          status: Database["public"]["Enums"]["contact_status"] | null
          tags: string[] | null
          twitter_url: string | null
          updated_at: string | null
          visibility: Database["public"]["Enums"]["visibility"]
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          client_id?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_contacted_at?: string | null
          last_name: string
          linkedin_url?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          role?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          tags?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility"]
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          client_id?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_contacted_at?: string | null
          last_name?: string
          linkedin_url?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          role?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          tags?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          actual_close_date: string | null
          client_email: string | null
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          contact_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          expected_close_date: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string | null
          priority: Database["public"]["Enums"]["deal_priority"] | null
          probability: number | null
          source: string | null
          stage: Database["public"]["Enums"]["deal_stage"] | null
          tags: string[] | null
          updated_at: string | null
          value: number
        }
        Insert: {
          actual_close_date?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id?: string | null
          priority?: Database["public"]["Enums"]["deal_priority"] | null
          probability?: number | null
          source?: string | null
          stage?: Database["public"]["Enums"]["deal_stage"] | null
          tags?: string[] | null
          updated_at?: string | null
          value?: number
        }
        Update: {
          actual_close_date?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string | null
          priority?: Database["public"]["Enums"]["deal_priority"] | null
          probability?: number | null
          source?: string | null
          stage?: Database["public"]["Enums"]["deal_stage"] | null
          tags?: string[] | null
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string | null
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel_id: string | null
          content: string
          created_at: string | null
          id: string
          sender_id: string | null
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          sender_id?: string | null
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          owner_id: string | null
          priority: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          owner_id?: string | null
          priority?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          owner_id?: string | null
          priority?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          description: string
          entity_id: string
          entity_type: string
          id: string
          is_read: boolean | null
          priority: string | null
          target_user_id: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          description: string
          entity_id: string
          entity_type: string
          id?: string
          is_read?: boolean | null
          priority?: string | null
          target_user_id: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          description?: string
          entity_id?: string
          entity_type?: string
          id?: string
          is_read?: boolean | null
          priority?: string | null
          target_user_id?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          owner: string | null
          priority: string | null
          related_entity: string | null
          related_entity_id: string | null
          status: string | null
          tags: string[] | null
          task_identifier: string | null
          time_spent: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          owner?: string | null
          priority?: string | null
          related_entity?: string | null
          related_entity_id?: string | null
          status?: string | null
          tags?: string[] | null
          task_identifier?: string | null
          time_spent?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          owner?: string | null
          priority?: string | null
          related_entity?: string | null
          related_entity_id?: string | null
          status?: string | null
          tags?: string[] | null
          task_identifier?: string | null
          time_spent?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      unread_messages: {
        Row: {
          channel_id: string
          count: number
          user_id: string
        }
        Insert: {
          channel_id: string
          count?: number
          user_id: string
        }
        Update: {
          channel_id?: string
          count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unread_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_login_at: string | null
          last_name: string | null
          phone: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"] | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_message_reaction_counts: {
        Args: { message_uuid: string }
        Returns: {
          emoji: string
          count: number
          user_reacted: boolean
        }[]
      }
      increment_unread: {
        Args: { p_user_id: string; p_channel_id: string }
        Returns: undefined
      }
      reset_unread_count: {
        Args: { user_uuid: string; channel_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      client_stage: "lead" | "prospect" | "active" | "inactive"
      contact_status: "active" | "inactive"
      deal_priority: "low" | "medium" | "high"
      deal_stage:
        | "prospect"
        | "qualified"
        | "proposal"
        | "negotiation"
        | "won"
        | "lost"
      user_role: "admin" | "manager" | "team_leader" | "user"
      user_status: "active" | "inactive"
      visibility: "public" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 