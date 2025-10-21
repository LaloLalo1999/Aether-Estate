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
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          status: 'Lead' | 'Active' | 'Inactive'
          last_contacted: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          status?: 'Lead' | 'Active' | 'Inactive'
          last_contacted?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          status?: 'Lead' | 'Active' | 'Inactive'
          last_contacted?: string
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          name: string
          address: string
          price: number
          status: 'For Sale' | 'Sold' | 'Pending'
          image_url: string
          bedrooms: number
          bathrooms: number
          sqft: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          price: number
          status?: 'For Sale' | 'Sold' | 'Pending'
          image_url: string
          bedrooms?: number
          bathrooms?: number
          sqft: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          price?: number
          status?: 'For Sale' | 'Sold' | 'Pending'
          image_url?: string
          bedrooms?: number
          bathrooms?: number
          sqft?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          date: string
          description: string
          category: 'Commission' | 'Expense' | 'Marketing' | 'Other'
          amount: number
          type: 'Income' | 'Expense'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date?: string
          description: string
          category?: 'Commission' | 'Expense' | 'Marketing' | 'Other'
          amount: number
          type: 'Income' | 'Expense'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          description?: string
          category?: 'Commission' | 'Expense' | 'Marketing' | 'Other'
          amount?: number
          type?: 'Income' | 'Expense'
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          property_id: string
          client_id: string
          status: 'Draft' | 'Sent' | 'Signed' | 'Expired'
          signing_date: string | null
          expiry_date: string
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          client_id: string
          status?: 'Draft' | 'Sent' | 'Signed' | 'Expired'
          signing_date?: string | null
          expiry_date: string
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          client_id?: string
          status?: 'Draft' | 'Sent' | 'Signed' | 'Expired'
          signing_date?: string | null
          expiry_date?: string
          amount?: number
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
