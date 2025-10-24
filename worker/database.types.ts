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
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          settings: Json
          subscription_tier: 'free' | 'professional' | 'enterprise'
          subscription_status: 'active' | 'cancelled' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          settings?: Json
          subscription_tier?: 'free' | 'professional' | 'enterprise'
          subscription_status?: 'active' | 'cancelled' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          settings?: Json
          subscription_tier?: 'free' | 'professional' | 'enterprise'
          subscription_status?: 'active' | 'cancelled' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          organization_id: string
          email: string
          full_name: string
          avatar_url: string | null
          phone: string | null
          role: 'super_admin' | 'admin' | 'manager' | 'agent' | 'viewer'
          is_active: boolean
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id: string
          email: string
          full_name: string
          avatar_url?: string | null
          phone?: string | null
          role?: 'super_admin' | 'admin' | 'manager' | 'agent' | 'viewer'
          is_active?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          phone?: string | null
          role?: 'super_admin' | 'admin' | 'manager' | 'agent' | 'viewer'
          is_active?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          organization_id: string
          name: string
          email: string
          phone: string
          status: 'Lead' | 'Active' | 'Inactive'
          last_contacted: string
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          email: string
          phone: string
          status?: 'Lead' | 'Active' | 'Inactive'
          last_contacted?: string
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          email?: string
          phone?: string
          status?: 'Lead' | 'Active' | 'Inactive'
          last_contacted?: string
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          organization_id: string
          name: string
          address: string
          price: number
          status: 'For Sale' | 'Sold' | 'Pending'
          image_url: string
          bedrooms: number
          bathrooms: number
          sqft: number
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          address: string
          price: number
          status?: 'For Sale' | 'Sold' | 'Pending'
          image_url: string
          bedrooms?: number
          bathrooms?: number
          sqft: number
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          address?: string
          price?: number
          status?: 'For Sale' | 'Sold' | 'Pending'
          image_url?: string
          bedrooms?: number
          bathrooms?: number
          sqft?: number
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          organization_id: string
          date: string
          description: string
          category: 'Commission' | 'Expense' | 'Marketing' | 'Other'
          amount: number
          type: 'Income' | 'Expense'
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          date?: string
          description: string
          category?: 'Commission' | 'Expense' | 'Marketing' | 'Other'
          amount: number
          type: 'Income' | 'Expense'
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          date?: string
          description?: string
          category?: 'Commission' | 'Expense' | 'Marketing' | 'Other'
          amount?: number
          type?: 'Income' | 'Expense'
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          organization_id: string
          property_id: string
          client_id: string
          status: 'Draft' | 'Sent' | 'Signed' | 'Expired'
          signing_date: string | null
          expiry_date: string
          amount: number
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          property_id: string
          client_id: string
          status?: 'Draft' | 'Sent' | 'Signed' | 'Expired'
          signing_date?: string | null
          expiry_date: string
          amount: number
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          property_id?: string
          client_id?: string
          status?: 'Draft' | 'Sent' | 'Signed' | 'Expired'
          signing_date?: string | null
          expiry_date?: string
          amount?: number
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      client_interactions: {
        Row: {
          id: string
          organization_id: string
          client_id: string
          user_id: string
          interaction_type: 'call' | 'email' | 'meeting' | 'note' | 'sms'
          subject: string
          content: string
          interaction_date: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          client_id: string
          user_id: string
          interaction_type: 'call' | 'email' | 'meeting' | 'note' | 'sms'
          subject: string
          content: string
          interaction_date?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          client_id?: string
          user_id?: string
          interaction_type?: 'call' | 'email' | 'meeting' | 'note' | 'sms'
          subject?: string
          content?: string
          interaction_date?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          organization_id: string
          conversation_id: string
          sender_id: string
          recipient_type: 'client' | 'user'
          recipient_id: string
          message_type: 'email' | 'sms' | 'internal'
          subject: string | null
          content: string
          status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed'
          read_at: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          conversation_id: string
          sender_id: string
          recipient_type: 'client' | 'user'
          recipient_id: string
          message_type: 'email' | 'sms' | 'internal'
          subject?: string | null
          content: string
          status?: 'draft' | 'sent' | 'delivered' | 'read' | 'failed'
          read_at?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          conversation_id?: string
          sender_id?: string
          recipient_type?: 'client' | 'user'
          recipient_id?: string
          message_type?: 'email' | 'sms' | 'internal'
          subject?: string | null
          content?: string
          status?: 'draft' | 'sent' | 'delivered' | 'read' | 'failed'
          read_at?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          organization_id: string
          client_id: string
          property_id: string | null
          user_id: string
          title: string
          description: string | null
          appointment_type: 'showing' | 'meeting' | 'call' | 'inspection' | 'closing'
          start_time: string
          end_time: string
          location: string | null
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          cal_com_event_id: string | null
          reminder_sent: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          client_id: string
          property_id?: string | null
          user_id: string
          title: string
          description?: string | null
          appointment_type: 'showing' | 'meeting' | 'call' | 'inspection' | 'closing'
          start_time: string
          end_time: string
          location?: string | null
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          cal_com_event_id?: string | null
          reminder_sent?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          client_id?: string
          property_id?: string | null
          user_id?: string
          title?: string
          description?: string | null
          appointment_type?: 'showing' | 'meeting' | 'call' | 'inspection' | 'closing'
          start_time?: string
          end_time?: string
          location?: string | null
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          cal_com_event_id?: string | null
          reminder_sent?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          organization_id: string
          entity_type: 'client' | 'property' | 'contract' | 'transaction' | 'organization'
          entity_id: string
          uploaded_by: string
          name: string
          file_url: string
          file_type: string
          file_size: number
          category: string
          is_signed: boolean
          signed_at: string | null
          docusign_envelope_id: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          entity_type: 'client' | 'property' | 'contract' | 'transaction' | 'organization'
          entity_id: string
          uploaded_by: string
          name: string
          file_url: string
          file_type: string
          file_size: number
          category?: string
          is_signed?: boolean
          signed_at?: string | null
          docusign_envelope_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          entity_type?: 'client' | 'property' | 'contract' | 'transaction' | 'organization'
          entity_id?: string
          uploaded_by?: string
          name?: string
          file_url?: string
          file_type?: string
          file_size?: number
          category?: string
          is_signed?: boolean
          signed_at?: string | null
          docusign_envelope_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
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
