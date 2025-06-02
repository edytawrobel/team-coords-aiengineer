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
      sessions: {
        Row: {
          id: string
          title: string
          description: string | null
          track: string | null
          room: string | null
          day: number | null
          start_time: string | null
          end_time: string | null
          date: string | null
          is_custom: boolean | null
          created_by: string | null
          speaker_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          track?: string | null
          room?: string | null
          day?: number | null
          start_time?: string | null
          end_time?: string | null
          date?: string | null
          is_custom?: boolean | null
          created_by?: string | null
          speaker_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          track?: string | null
          room?: string | null
          day?: number | null
          start_time?: string | null
          end_time?: string | null
          date?: string | null
          is_custom?: boolean | null
          created_by?: string | null
          speaker_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      speakers: {
        Row: {
          id: string
          name: string
          bio: string | null
          company: string | null
          title: string | null
          image: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          bio?: string | null
          company?: string | null
          title?: string | null
          image?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          company?: string | null
          title?: string | null
          image?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}