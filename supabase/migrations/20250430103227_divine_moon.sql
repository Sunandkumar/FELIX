/*
  # Create all_connections table

  1. New Tables
    - `all_connections` table with fields for user connections
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `mobile` (text)
      - `email` (text)
      - `title` (text)
      - `company` (text) 
      - `batch` (text)
      - `industry` (text)
      - `photo` (text)
      - `looking` (text)
      - `offering` (text)
      - `linkedin` (text)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create all_connections table
CREATE TABLE all_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  mobile text,
  email text,
  title text,
  company text,
  batch text,
  industry text,
  photo text,
  looking text,
  offering text,
  linkedin text,
  CONSTRAINT email_format CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT mobile_format CHECK (mobile IS NULL OR mobile ~ '^\+?[1-9]\d{1,14}$')
);

-- Enable Row Level Security
ALTER TABLE all_connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read all connections"
  ON all_connections
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for faster searches
CREATE INDEX all_connections_name_idx ON all_connections (name);
CREATE INDEX all_connections_industry_idx ON all_connections (industry);
CREATE INDEX all_connections_batch_idx ON all_connections (batch);