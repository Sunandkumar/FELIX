/*
  # Fix user creation trigger function

  1. Changes
    - Update trigger function to properly handle phone-based authentication
    - Fix email handling for phone-only users
    - Ensure all fields have proper default values
    - Remove email uniqueness constraint when using phone auth

  2. Security
    - Maintains existing RLS policies
    - Ensures data integrity with proper constraints
*/

-- Update trigger function to handle phone auth properly
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

-- Drop existing email uniqueness constraint if it exists
DROP INDEX IF EXISTS users_email_unique_idx;

-- Create new partial unique index that excludes phone-based emails
CREATE UNIQUE INDEX users_email_unique_idx ON users (email)
WHERE email NOT LIKE '%@phone.mba-alumni.app';