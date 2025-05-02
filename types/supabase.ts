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
          created_at: string
          email: string
          phone: string | null
          name: string
          title: string
          company: string
          batch: string
          industry: string
          photo: string
          looking_for: string | null
          offering: string | null
          points: number
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          phone?: string | null
          name: string
          title: string
          company: string
          batch: string
          industry: string
          photo: string
          looking_for?: string | null
          offering?: string | null
          points?: number
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          phone?: string | null
          name?: string
          title?: string
          company?: string
          batch?: string
          industry?: string
          photo?: string
          looking_for?: string | null
          offering?: string | null
          points?: number
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