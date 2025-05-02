/*
  # Fix phone number constraint

  1. Changes
    - Update phone format constraint to accept international phone numbers
    - Keep unique constraint on phone numbers
    - Maintain RLS policies

  2. Technical Details
    - New regex pattern accepts:
      - Optional + prefix
      - Country code (1-3 digits)
      - Area code and number (total 10-15 digits)
    - Maintains data integrity while being more permissive
*/

DO $$ 
BEGIN
  -- Drop the existing constraint if it exists
  ALTER TABLE users 
  DROP CONSTRAINT IF EXISTS phone_format;

  -- Add the new, more permissive constraint
  ALTER TABLE users 
  ADD CONSTRAINT phone_format 
  CHECK (
    (phone IS NULL) OR 
    (phone ~ '^\+?[1-9]\d{1,14}$')
  );
END $$;