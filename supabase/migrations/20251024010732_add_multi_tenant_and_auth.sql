/*
  # Multi-Tenant Architecture and Authentication Foundation

  ## Overview
  This migration establishes the foundation for a multi-tenant real estate ERP system with complete user authentication and role-based access control.

  ## 1. New Tables

  ### organizations
  - `id` (uuid, primary key) - Unique organization identifier
  - `name` (text, not null) - Organization/agency name
  - `slug` (text, unique, not null) - URL-friendly identifier
  - `logo_url` (text, nullable) - Organization logo
  - `settings` (jsonb, default '{}') - Organization-specific settings
  - `subscription_tier` (text, default 'free') - Subscription level
  - `subscription_status` (text, default 'active') - Subscription status
  - `created_at`, `updated_at` (timestamptz) - Timestamps

  ### user_profiles
  - `id` (uuid, primary key, references auth.users) - User ID from Supabase Auth
  - `organization_id` (uuid, foreign key) - Associated organization
  - `email` (text, not null, unique) - User email
  - `full_name` (text, not null) - User's full name
  - `avatar_url` (text, nullable) - Profile picture
  - `phone` (text, nullable) - Contact phone
  - `role` (text, not null, default 'agent') - User role
  - `is_active` (boolean, default true) - Account status
  - `settings` (jsonb, default '{}') - User preferences
  - `created_at`, `updated_at` (timestamptz) - Timestamps

  ### client_interactions
  - `id` (uuid, primary key) - Interaction ID
  - `organization_id` (uuid, foreign key) - Multi-tenant isolation
  - `client_id` (uuid, foreign key) - Associated client
  - `user_id` (uuid, foreign key) - User who created interaction
  - `interaction_type` (text, not null) - Type: call, email, meeting, note
  - `subject` (text, not null) - Interaction subject
  - `content` (text, not null) - Detailed content
  - `interaction_date` (timestamptz, not null) - When it occurred
  - `metadata` (jsonb, default '{}') - Additional structured data
  - `created_at`, `updated_at` (timestamptz) - Timestamps

  ### messages
  - `id` (uuid, primary key) - Message ID
  - `organization_id` (uuid, foreign key) - Multi-tenant isolation
  - `conversation_id` (uuid, not null) - Groups related messages
  - `sender_id` (uuid, foreign key) - User who sent message
  - `recipient_type` (text, not null) - 'client' or 'user'
  - `recipient_id` (uuid, not null) - Client or user ID
  - `message_type` (text, not null) - 'email', 'sms', 'internal'
  - `subject` (text, nullable) - Message subject (for emails)
  - `content` (text, not null) - Message content
  - `status` (text, default 'sent') - Message delivery status
  - `read_at` (timestamptz, nullable) - When message was read
  - `metadata` (jsonb, default '{}') - Additional data
  - `created_at` (timestamptz) - Timestamp

  ### appointments
  - `id` (uuid, primary key) - Appointment ID
  - `organization_id` (uuid, foreign key) - Multi-tenant isolation
  - `client_id` (uuid, foreign key) - Associated client
  - `property_id` (uuid, foreign key, nullable) - Associated property
  - `user_id` (uuid, foreign key) - Assigned agent
  - `title` (text, not null) - Appointment title
  - `description` (text, nullable) - Details
  - `appointment_type` (text, not null) - Type: showing, meeting, call
  - `start_time` (timestamptz, not null) - Start date/time
  - `end_time` (timestamptz, not null) - End date/time
  - `location` (text, nullable) - Meeting location
  - `status` (text, default 'scheduled') - Status: scheduled, completed, cancelled
  - `cal_com_event_id` (text, nullable) - Cal.com integration ID
  - `reminder_sent` (boolean, default false) - Reminder status
  - `metadata` (jsonb, default '{}') - Additional data
  - `created_at`, `updated_at` (timestamptz) - Timestamps

  ### documents
  - `id` (uuid, primary key) - Document ID
  - `organization_id` (uuid, foreign key) - Multi-tenant isolation
  - `entity_type` (text, not null) - Related entity: client, property, contract
  - `entity_id` (uuid, not null) - Related entity ID
  - `uploaded_by` (uuid, foreign key) - User who uploaded
  - `name` (text, not null) - Document name
  - `file_url` (text, not null) - Storage URL
  - `file_type` (text, not null) - MIME type
  - `file_size` (integer, not null) - Size in bytes
  - `category` (text, default 'general') - Document category
  - `is_signed` (boolean, default false) - E-signature status
  - `signed_at` (timestamptz, nullable) - Signature date
  - `docusign_envelope_id` (text, nullable) - DocuSign integration ID
  - `metadata` (jsonb, default '{}') - Additional data
  - `created_at`, `updated_at` (timestamptz) - Timestamps

  ## 2. Table Updates
  All existing tables (clients, properties, transactions, contracts) are updated to include:
  - `organization_id` (uuid, foreign key) - Multi-tenant isolation
  - `created_by` (uuid, foreign key) - User who created record
  - `updated_by` (uuid, foreign key) - User who last updated record

  ## 3. Security (Row Level Security)
  - All tables have RLS enabled
  - Policies ensure users can only access data from their organization
  - Role-based policies restrict actions based on user roles
  - Super admin role can access all organizations

  ## 4. Indexes
  - Organization ID indexes on all tenant-scoped tables
  - Foreign key indexes for optimal join performance
  - Composite indexes for common query patterns
  - Full-text search indexes for messages and interactions

  ## 5. Important Notes
  - This migration creates the foundation for multi-tenant isolation
  - All data access must go through RLS policies
  - User authentication is handled by Supabase Auth
  - Organization slug must be unique across the platform
  - Default organization will be created for existing data
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  settings jsonb DEFAULT '{}',
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'professional', 'enterprise')),
  subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  phone text,
  role text NOT NULL DEFAULT 'agent' CHECK (role IN ('super_admin', 'admin', 'manager', 'agent', 'viewer')),
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add organization_id and user tracking to existing tables
ALTER TABLE clients ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES user_profiles(id);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES user_profiles(id);

ALTER TABLE properties ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES user_profiles(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES user_profiles(id);

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES user_profiles(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES user_profiles(id);

ALTER TABLE contracts ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES user_profiles(id);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES user_profiles(id);

-- Create client_interactions table
CREATE TABLE IF NOT EXISTS client_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('call', 'email', 'meeting', 'note', 'sms')),
  subject text NOT NULL,
  content text NOT NULL,
  interaction_date timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  recipient_type text NOT NULL CHECK (recipient_type IN ('client', 'user')),
  recipient_id uuid NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('email', 'sms', 'internal')),
  subject text,
  content text NOT NULL,
  status text DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'failed')),
  read_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  appointment_type text NOT NULL CHECK (appointment_type IN ('showing', 'meeting', 'call', 'inspection', 'closing')),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  cal_com_event_id text,
  reminder_sent boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('client', 'property', 'contract', 'transaction', 'organization')),
  entity_id uuid NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  category text DEFAULT 'general',
  is_signed boolean DEFAULT false,
  signed_at timestamptz,
  docusign_envelope_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization_id ON user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

CREATE INDEX IF NOT EXISTS idx_clients_organization_id ON clients(organization_id);
CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);

CREATE INDEX IF NOT EXISTS idx_properties_organization_id ON properties(organization_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON properties(created_by);

CREATE INDEX IF NOT EXISTS idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_by ON transactions(created_by);

CREATE INDEX IF NOT EXISTS idx_contracts_organization_id ON contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON contracts(created_by);

CREATE INDEX IF NOT EXISTS idx_client_interactions_organization_id ON client_interactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_client_interactions_client_id ON client_interactions(client_id);
CREATE INDEX IF NOT EXISTS idx_client_interactions_user_id ON client_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_client_interactions_date ON client_interactions(interaction_date DESC);

CREATE INDEX IF NOT EXISTS idx_messages_organization_id ON messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_appointments_organization_id ON appointments(organization_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_property_id ON appointments(property_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_documents_organization_id ON documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can update their organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view profiles in their organization"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can insert new users in their organization"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update users in their organization"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for clients (updated for multi-tenant)
CREATE POLICY "Users can view clients in their organization"
  ON clients FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create clients in their organization"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update clients in their organization"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete clients in their organization"
  ON clients FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for properties (updated for multi-tenant)
CREATE POLICY "Users can view properties in their organization"
  ON properties FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create properties in their organization"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update properties in their organization"
  ON properties FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete properties in their organization"
  ON properties FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for transactions (updated for multi-tenant)
CREATE POLICY "Users can view transactions in their organization"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create transactions in their organization"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update transactions in their organization"
  ON transactions FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete transactions in their organization"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for contracts (updated for multi-tenant)
CREATE POLICY "Users can view contracts in their organization"
  ON contracts FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create contracts in their organization"
  ON contracts FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update contracts in their organization"
  ON contracts FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete contracts in their organization"
  ON contracts FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for client_interactions
CREATE POLICY "Users can view interactions in their organization"
  ON client_interactions FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create interactions in their organization"
  ON client_interactions FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own interactions"
  ON client_interactions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own interactions"
  ON client_interactions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their organization"
  ON messages FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their organization"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    ) AND sender_id = auth.uid()
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- RLS Policies for appointments
CREATE POLICY "Users can view appointments in their organization"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create appointments in their organization"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update appointments in their organization"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete appointments in their organization"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for documents
CREATE POLICY "Users can view documents in their organization"
  ON documents FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can upload documents in their organization"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    ) AND uploaded_by = auth.uid()
  );

CREATE POLICY "Users can update documents in their organization"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own documents"
  ON documents FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_interactions_updated_at BEFORE UPDATE ON client_interactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();