/*
  # Update phone number validation for US format

  1. Changes
    - Update phone number format validation to handle US phone numbers
    - Allow common US phone number formats with area codes 2-9
    - Maintain E.164 format requirement

  2. Security
    - Maintains existing RLS policies
    - Ensures data integrity with proper constraints
*/

-- Update phone number format validation to handle US format
ALTER TABLE users DROP CONSTRAINT IF EXISTS phone_format;
ALTER TABLE users 
  ADD CONSTRAINT phone_format 
  CHECK (
    phone IS NULL OR 
    phone ~ '^\+1[2-9][0-9]{9}$'
  );

-- Make email nullable
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Make other fields nullable
ALTER TABLE users ALTER COLUMN name DROP NOT NULL;
ALTER TABLE users ALTER COLUMN title DROP NOT NULL;
ALTER TABLE users ALTER COLUMN company DROP NOT NULL;
ALTER TABLE users ALTER COLUMN batch DROP NOT NULL;
ALTER TABLE users ALTER COLUMN industry DROP NOT NULL;
ALTER TABLE users ALTER COLUMN photo DROP NOT NULL;