/*
  # Update app_state table RLS policies

  1. Changes
    - Add RLS policies for anonymous users to access app_state table
    - Allow anonymous users to:
      - Read app state
      - Insert new app state
      - Update existing app state
    
  2. Security
    - Enables access for both authenticated and anonymous users
    - Maintains existing policies for authenticated users
*/

-- Drop existing policies to recreate them with both anon and authenticated access
DROP POLICY IF EXISTS "Allow authenticated users to insert app state" ON app_state;
DROP POLICY IF EXISTS "Allow authenticated users to read app state" ON app_state;
DROP POLICY IF EXISTS "Allow authenticated users to update app state" ON app_state;

-- Create new policies that allow both anonymous and authenticated users
CREATE POLICY "Allow users to insert app state"
ON app_state
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow users to read app state"
ON app_state
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow users to update app state"
ON app_state
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);