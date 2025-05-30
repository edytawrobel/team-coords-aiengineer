/*
  # Create app_state table for application state management

  1. New Tables
    - `app_state`
      - `id` (text, primary key)
      - `state` (jsonb)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `app_state` table
    - Add policies for:
      - Select: Allow authenticated users to read all states
      - Insert/Update: Allow authenticated users to create and update states
*/

-- Create the app_state table
CREATE TABLE IF NOT EXISTS public.app_state (
    id text PRIMARY KEY,
    state jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.app_state ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read app state"
    ON public.app_state
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert app state"
    ON public.app_state
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update app state"
    ON public.app_state
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_app_state_updated_at
    BEFORE UPDATE ON public.app_state
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();