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
      campaigns: {
        Row: {
          id: string
          name: string
          tagline: string
          status: string
          collection_start: string | null
          collection_end: string | null
          voting_start: string | null
          voting_end: string | null
          submission_limit: number | null
          announcement_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string
          color: string
          active: boolean
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      problem_options: {
        Row: {
          id: string
          category_id: string
          label: string
          active: boolean
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['problem_options']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['problem_options']['Insert']>
      }
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          email_verified: boolean
          district: string | null
          consent: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      ideas: {
        Row: {
          id: string
          public_id: string
          user_id: string | null
          category_id: string
          problem_option_id: string | null
          title: string
          description: string | null
          solution_description: string | null
          district: string
          scope: string | null
          status: string
          visibility: string
          admin_notes: string | null
          similarity_group_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ideas']['Row'], 'id' | 'public_id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['ideas']['Insert']>
      }
      idea_groups: {
        Row: {
          id: string
          title: string
          description: string | null
          category_id: string | null
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['idea_groups']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['idea_groups']['Insert']>
      }
      idea_group_members: {
        Row: {
          idea_id: string
          group_id: string
        }
        Insert: Database['public']['Tables']['idea_group_members']['Row']
        Update: Partial<Database['public']['Tables']['idea_group_members']['Row']>
      }
      votes: {
        Row: {
          id: string
          idea_id: string
          voter_identifier: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['votes']['Row'], 'id' | 'created_at'>
        Update: never
      }
      email_events: {
        Row: {
          id: string
          user_id: string
          type: string
          status: string
          sent_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['email_events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['email_events']['Insert']>
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
  }
}

export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type ProblemOption = Database['public']['Tables']['problem_options']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Idea = Database['public']['Tables']['ideas']['Row']
export type IdeaGroup = Database['public']['Tables']['idea_groups']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type EmailEvent = Database['public']['Tables']['email_events']['Row']
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
