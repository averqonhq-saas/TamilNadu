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
          allow_results_before_close: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      idea_group_members: {
        Row: {
          idea_id: string
          group_id: string
        }
        Insert: Database['public']['Tables']['idea_group_members']['Row']
        Update: Partial<Database['public']['Tables']['idea_group_members']['Row']>
        Relationships: []
      }
      votes: {
        Row: {
          id: string
          idea_id: string
          voter_identifier: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['votes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['votes']['Row']>
        Relationships: []
      }
      public_votes: {
        Row: {
          id: string
          campaign_id: string | null
          idea_id: string
          voter_hash: string
          voter_email_masked: string | null
          district: string | null
          client_ip_hash: string | null
          user_agent_hash: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['public_votes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['public_votes']['Row']>
        Relationships: []
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
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>
        Relationships: []
      }
      admin_2fa: {
        Row: {
          id: string
          admin_user_id: string | null
          admin_email: string
          enabled: boolean
          secret_encrypted: string
          recovery_codes: Json
          created_at: string
          verified_at: string | null
          last_used_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['admin_2fa']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['admin_2fa']['Insert']>
        Relationships: []
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
        Update: Partial<Database['public']['Tables']['audit_logs']['Row']>
        Relationships: []
      }
      inquiries: {
        Row: {
          id: string
          type: string
          name: string
          email: string
          phone: string | null
          organization: string | null
          role: string | null
          subject: string | null
          message: string
          district: string | null
          status: string
          admin_notes: string | null
          responded_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
        Relationships: []
      }
    }
    Views: {
      public_ideas_view: {
        Row: {
          id: string
          public_id: string
          title: string
          description: string | null
          district: string
          status: string
          category_id: string
          created_at: string
          category_name: string | null
          category_slug: string | null
          category_icon: string | null
          category_color: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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
export type PublicVote = Database['public']['Tables']['public_votes']['Row']
export type EmailEvent = Database['public']['Tables']['email_events']['Row']
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type Admin2FA = Database['public']['Tables']['admin_2fa']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type Inquiry = Database['public']['Tables']['inquiries']['Row']
