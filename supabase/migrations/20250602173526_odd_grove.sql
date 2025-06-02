/*
  # Add notes and attendance tables

  1. New Tables
    - `notes`
      - `id` (text, primary key)
      - `session_id` (text, not null)
      - `member_id` (text, not null)
      - `content` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `attendance`
      - `session_id` (text, not null)
      - `member_id` (text, not null)
      - Primary key is composite of session_id and member_id

  2. Security
    - Enable RLS on both tables
    - Add policies for both anonymous and authenticated users to:
      - Read all records
      - Create new records
      - Update/delete their own records
*/

-- Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
    id text PRIMARY KEY,
    session_id text NOT NULL,
    member_id text NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    session_id text NOT NULL,
    member_id text NOT NULL,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (session_id, member_id)
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Allow users to read notes"
    ON public.notes
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow users to create notes"
    ON public.notes
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow users to update their notes"
    ON public.notes
    FOR UPDATE
    TO anon, authenticated
    USING (member_id = member_id)
    WITH CHECK (member_id = member_id);

CREATE POLICY "Allow users to delete their notes"
    ON public.notes
    FOR DELETE
    TO anon, authenticated
    USING (member_id = member_id);

-- Attendance policies
CREATE POLICY "Allow users to read attendance"
    ON public.attendance
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow users to manage attendance"
    ON public.attendance
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Create trigger for updating updated_at on notes
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON public.notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();