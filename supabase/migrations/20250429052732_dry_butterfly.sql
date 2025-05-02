-- Drop existing table and objects
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;

-- Create users table with proper constraints
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  email text,
  phone text UNIQUE,
  name text DEFAULT '',
  title text DEFAULT '',
  company text DEFAULT '',
  batch text DEFAULT '',
  industry text DEFAULT '',
  photo text DEFAULT '',
  looking_for text,
  offering text,
  points integer DEFAULT 0,
  CONSTRAINT email_length CHECK (email IS NULL OR char_length(email) >= 3),
  CONSTRAINT phone_format CHECK (phone IS NULL OR phone ~ '^\+91[6-9][0-9]{9}$')
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create unique index for email that excludes phone-based emails
CREATE UNIQUE INDEX users_email_unique_idx ON users (email)
WHERE email NOT LIKE '%@phone.mba-alumni.app';

-- Create trigger function for user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    phone,
    name,
    title,
    company,
    batch,
    industry,
    photo,
    points
  )
  VALUES (
    new.id,
    CASE 
      WHEN new.email IS NOT NULL AND length(new.email) >= 3 THEN new.email
      WHEN new.phone IS NOT NULL THEN new.phone || '@phone.mba-alumni.app'
      ELSE NULL
    END,
    new.phone,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'title', ''),
    COALESCE(new.raw_user_meta_data->>'company', ''),
    COALESCE(new.raw_user_meta_data->>'batch', ''),
    COALESCE(new.raw_user_meta_data->>'industry', ''),
    COALESCE(new.raw_user_meta_data->>'photo', ''),
    0
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();