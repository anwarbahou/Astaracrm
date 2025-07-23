export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string
          avatar_url: string | null
          role: 'admin' | 'manager' | 'team_leader' | 'user'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email: string
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'team_leader' | 'user'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'team_leader' | 'user'
          created_at?: string
          updated_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          type: string
          title: string
          description: string
          user_id: string
          target_user_id: string
          entity_id: string
          entity_type: string
          data: Json | null
          is_read: boolean
          priority: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          type: string
          title: string
          description: string
          user_id: string
          target_user_id: string
          entity_id: string
          entity_type: string
          data?: Json | null
          is_read?: boolean
          priority?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          type?: string
          title?: string
          description?: string
          user_id?: string
          target_user_id?: string
          entity_id?: string
          entity_type?: string
          data?: Json | null
          is_read?: boolean
          priority?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      deals: {
        Row: {
          id: string
          name: string
          client_id: string | null
          client_name: string | null
          value: number
          currency: string
          stage: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
          probability: number
          expected_close_date: string | null
          source: string | null
          owner_id: string | null
          tags: string[] | null
          priority: 'low' | 'medium' | 'high'
          notes: string | null
          description: string | null
          created_at: string
          updated_at: string | null
          website: string | null
          rating: number | null
          assignee_id: string | null
        }
        Insert: {
          id?: string
          name: string
          client_id?: string | null
          client_name?: string | null
          value: number
          currency?: string
          stage?: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
          probability?: number
          expected_close_date?: string | null
          source?: string | null
          owner_id?: string | null
          tags?: string[] | null
          priority?: 'low' | 'medium' | 'high'
          notes?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string | null
          website?: string | null
          rating?: number | null
          assignee_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          client_id?: string | null
          client_name?: string | null
          value?: number
          currency?: string
          stage?: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
          probability?: number
          expected_close_date?: string | null
          source?: string | null
          owner_id?: string | null
          tags?: string[] | null
          priority?: 'low' | 'medium' | 'high'
          notes?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string | null
          website?: string | null
          rating?: number | null
          assignee_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

