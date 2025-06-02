-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sessions table with embedded speaker info
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
    speaker_name text NOT NULL,
    speaker_bio text,
    speaker_company text,
    speaker_title text,
    speaker_image text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

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

-- Create updated_at trigger
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();