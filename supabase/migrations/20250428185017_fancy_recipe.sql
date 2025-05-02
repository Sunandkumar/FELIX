/*
  # Update user creation for phone authentication

  1. Changes
    - Modify trigger function to handle phone number authentication
    - Add phone number field to users table
    - Update user creation logic to work with phone auth

  2. Security
    - Maintains existing RLS policies
*/

-- Add phone number field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text UNIQUE;

-- Update trigger function to handle phone auth
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
    COALESCE(new.email, new.phone || '@phone.mba-alumni.app'),
    new.phone,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'title', ''),
    COALESCE(new.raw_user_meta_data->>'company', ''),
    COALESCE(new.raw_user_meta_data->>'batch', ''),
    COALESCE(new.raw_user_meta_data->>'industry', ''),
    COALESCE(new.raw_user_meta_data->>'photo', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;