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
          name: string
          role: string | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          title: string
          description: string | null
          session_format: string | null
          assigned_track: string | null
          room: string
          scheduled_at: string
          starts_at: string
          ends_at: string
          speakers: string[] | null
          companies: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          session_format?: string | null
          assigned_track?: string | null
          room: string
          scheduled_at: string
          starts_at: string
          ends_at: string
          speakers?: string[] | null
          companies?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          session_format?: string | null
          assigned_track?: string | null
          room?: string
          scheduled_at?: string
          starts_at?: string
          ends_at?: string
          speakers?: string[] | null
          companies?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      attendees: {
        Row: {
          id: string
          session_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          session_id: string
          contributor_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          contributor_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          contributor_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}