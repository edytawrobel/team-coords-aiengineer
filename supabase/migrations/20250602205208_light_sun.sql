/*
  # Create sessions table and import initial data

  1. New Tables
    - `sessions`
      - `id` (text, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `track` (text)
      - `room` (text)
      - `day` (integer)
      - `start_time` (text)
      - `end_time` (text)
      - `date` (text)
      - `is_custom` (boolean)
      - `created_by` (text)
      - `speaker_id` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `speakers`
      - `id` (text, primary key)
      - `name` (text, not null)
      - `bio` (text)
      - `company` (text)
      - `title` (text)
      - `image` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for both anonymous and authenticated users
*/

-- Create speakers table
CREATE TABLE IF NOT EXISTS public.speakers (
    id text PRIMARY KEY,
    name text NOT NULL,
    bio text,
    company text,
    title text,
    image text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text,
    track text,
    room text,
    day integer,
    start_time text,
    end_time text,
    date text,
    is_custom boolean DEFAULT false,
    created_by text,
    speaker_id text REFERENCES public.speakers(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for speakers
CREATE POLICY "Allow users to read speakers"
    ON public.speakers FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow users to create speakers"
    ON public.speakers FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow users to update speakers"
    ON public.speakers FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for sessions
CREATE POLICY "Allow users to read sessions"
    ON public.sessions FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow users to create sessions"
    ON public.sessions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow users to update sessions"
    ON public.sessions FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow users to delete sessions"
    ON public.sessions FOR DELETE
    TO anon, authenticated
    USING (is_custom = true);

-- Create updated_at triggers
CREATE TRIGGER update_speakers_updated_at
    BEFORE UPDATE ON public.speakers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();