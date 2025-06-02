/*
  # Add team members table

  1. New Tables
    - `team_members`
      - `id` (text, primary key)
      - `name` (text, not null)
      - `role` (text, not null)
      - `avatar` (text)
      - `color` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on team_members table
    - Add policies for both anonymous and authenticated users to:
      - Read all team members
      - Create new team members
      - Update existing team members
      - Delete team members
*/

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id text PRIMARY KEY,
    name text NOT NULL,
    role text NOT NULL,
    avatar text,
    color text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for both anonymous and authenticated users
CREATE POLICY "Allow users to read team members"
    ON public.team_members
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow users to create team members"
    ON public.team_members
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow users to update team members"
    ON public.team_members
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow users to delete team members"
    ON public.team_members
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Create trigger for updating updated_at
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();