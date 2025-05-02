/*
  # Update email format constraint

  1. Changes
    - Make email constraint more permissive
    - Allow NULL values for email field
    - Maintain mobile number validation
    - Keep existing indexes and policies

  2. Security
    - Maintains RLS policies
    - Preserves data integrity with basic validation
*/

-- Drop the existing email constraint
ALTER TABLE all_connections DROP CONSTRAINT IF EXISTS email_format;

-- Add a more permissive email constraint
ALTER TABLE all_connections 
  ADD CONSTRAINT email_format 
  CHECK (
    email IS NULL OR 
    length(email) >= 3
  );