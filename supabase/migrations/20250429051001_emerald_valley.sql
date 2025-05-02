/*
  # Fix user creation issues

  1. Changes
    - Remove unnecessary constraints that might block user creation
    - Update trigger function to handle missing metadata gracefully
    - Make non-critical fields nullable to allow initial user creation
    - Preserve phone number validation while making it optional
    - Ensure email uniqueness only when email is not null

  2. Security
    - Maintains existing RLS policies
    - Ensures data integrity with proper constraints
*/

-- Make non-critical fields nullable
ALTER TABLE users 
  ALTER COLUMN name DROP NOT NULL,
  ALTER COLUMN title DROP NOT NULL,
  ALTER COLUMN company DROP NOT NULL,
  ALTER COLUMN batch DROP NOT NULL,
  ALTER COLUMN industry DROP NOT NULL,
  ALTER COLUMN photo DROP NOT NULL;

-- Drop the old email uniqueness constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;

-- Add a partial unique index for email that excludes null values
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users (email) WHERE email IS NOT NULL;

-- Update the email length check to only apply when email is not null
ALTER TABLE users DROP CONSTRAINT IF EXISTS email_length;
ALTER TABLE users 
  ADD CONSTRAINT email_length 
  CHECK (email IS NULL OR char_length(email) >= 3);

-- Update trigger to handle missing metadata gracefully
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
    photo
  )
  VALUES (
    new.id,
    CASE 
      WHEN new.email IS NOT NULL AND length(new.email) >= 3 THEN new.email
      ELSE NULL
    END,
    new.phone,
    COALESCE(new.raw_user_meta_data->>'name', NULL),
    COALESCE(new.raw_user_meta_data->>'title', NULL),
    COALESCE(new.raw_user_meta_data->>'company', NULL),
    COALESCE(new.raw_user_meta_data->>'batch', NULL),
    COALESCE(new.raw_user_meta_data->>'industry', NULL),
    COALESCE(new.raw_user_meta_data->>'photo', NULL)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;