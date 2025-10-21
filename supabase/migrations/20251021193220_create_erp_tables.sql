/*
  # Create ERP/CRM Tables for Aether Estate

  ## Overview
  This migration creates the core database schema for the Aether Estate ERP system,
  replacing Cloudflare Durable Objects with PostgreSQL tables.

  ## New Tables

  ### 1. `clients` table
  - `id` (uuid, primary key) - Unique client identifier
  - `name` (text) - Client full name
  - `email` (text, unique) - Client email address
  - `phone` (text) - Client phone number
  - `status` (text) - Client status: Lead, Active, or Inactive
  - `last_contacted` (timestamptz) - Last contact date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 2. `properties` table
  - `id` (uuid, primary key) - Unique property identifier
  - `name` (text) - Property name/title
  - `address` (text) - Property full address
  - `price` (numeric) - Property price
  - `status` (text) - Property status: For Sale, Sold, or Pending
  - `image_url` (text) - Property image URL
  - `bedrooms` (integer) - Number of bedrooms
  - `bathrooms` (integer) - Number of bathrooms
  - `sqft` (integer) - Square footage
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 3. `transactions` table
  - `id` (uuid, primary key) - Unique transaction identifier
  - `date` (timestamptz) - Transaction date
  - `description` (text) - Transaction description
  - `category` (text) - Category: Commission, Expense, Marketing, or Other
  - `amount` (numeric) - Transaction amount (positive for income, negative for expenses)
  - `type` (text) - Transaction type: Income or Expense
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 4. `contracts` table
  - `id` (uuid, primary key) - Unique contract identifier
  - `property_id` (uuid, foreign key) - Reference to properties table
  - `client_id` (uuid, foreign key) - Reference to clients table
  - `status` (text) - Contract status: Draft, Sent, Signed, or Expired
  - `signing_date` (timestamptz, nullable) - Contract signing date
  - `expiry_date` (timestamptz) - Contract expiry date
  - `amount` (numeric) - Contract amount
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Add policies for authenticated users to manage their data
  - Future-proof for multi-tenancy support

  ## Indexes
  - Index on email for clients (unique)
  - Index on status fields for filtering
  - Index on foreign keys for join performance
  - Index on date fields for sorting and filtering
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'Lead' CHECK (status IN ('Lead', 'Active', 'Inactive')),
  last_contacted timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  status text NOT NULL DEFAULT 'For Sale' CHECK (status IN ('For Sale', 'Sold', 'Pending')),
  image_url text NOT NULL,
  bedrooms integer NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
  bathrooms integer NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
  sqft integer NOT NULL CHECK (sqft > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL DEFAULT now(),
  description text NOT NULL,
  category text NOT NULL DEFAULT 'Other' CHECK (category IN ('Commission', 'Expense', 'Marketing', 'Other')),
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('Income', 'Expense')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Signed', 'Expired')),
  signing_date timestamptz,
  expiry_date timestamptz NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_contracts_property_id ON contracts(property_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_expiry_date ON contracts(expiry_date);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at on record modification
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (allow all operations)
-- These should be restricted in production with proper authentication
CREATE POLICY "Allow all operations on clients"
  ON clients
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on properties"
  ON properties
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on transactions"
  ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on contracts"
  ON contracts
  FOR ALL
  USING (true)
  WITH CHECK (true);