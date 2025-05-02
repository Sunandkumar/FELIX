/*
  # Fix Users Table RLS Policies

  1. Changes
    - Add RLS policy for inserting new users
    - Add RLS policy for updating user data
    - Add RLS policy for reading user data

  2. Security
    - Enable RLS on users table
    - Add policies to allow authenticated users to:
      - Insert their own user record
      - Update their own user record
      - Read their own user record
*/

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for inserting new users
CREATE POLICY "Users can insert their own data"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy for updating user data
CREATE POLICY "Users can update their own data"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy for reading user data
CREATE POLICY "Users can read their own data"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);