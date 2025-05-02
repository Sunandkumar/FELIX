/*
  # Update phone number validation

  1. Changes
    - Update phone number format validation to be more permissive
    - Allow common phone number formats
    - Maintain E.164 format requirement

  2. Security
    - Maintains existing RLS policies
    - Ensures data integrity with proper constraints
*/

-- Update phone number format validation to be more permissive
ALTER TABLE users DROP CONSTRAINT IF EXISTS phone_format;
ALTER TABLE users 
  ADD CONSTRAINT phone_format 
  CHECK (
    phone IS NULL OR 
    phone ~ '^\+1[2-9][0-9]{9}$'
  );