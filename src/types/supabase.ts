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
          speaker_name: string
          speaker_bio: string | null
          speaker_company: string | null
          speaker_title: string | null
          speaker_image: string | null
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
          speaker_name: string
          speaker_bio?: string | null
          speaker_company?: string | null
          speaker_title?: string | null
          speaker_image?: string | null
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
          speaker_name?: string
          speaker_bio?: string | null
          speaker_company?: string | null
          speaker_title?: string | null
          speaker_image?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}