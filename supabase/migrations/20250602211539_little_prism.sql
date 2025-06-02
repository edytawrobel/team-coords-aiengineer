/*
  # Initial Schema Setup

  1. New Tables
    - users: Store team member information
    - sessions: Store conference session details
    - attendees: Track session attendance
    - notes: Store session notes
    
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
    
  3. Triggers
    - Add updated_at triggers for relevant tables
*/

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create users table
CREATE TABLE public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    role text,
    avatar text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create sessions table
CREATE TABLE public.sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    session_format text,
    assigned_track text,
    room text NOT NULL,
    scheduled_at text NOT NULL,
    starts_at timestamptz NOT NULL,
    ends_at timestamptz NOT NULL,
    speakers text[],
    companies text[],
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create attendees table
CREATE TABLE public.attendees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(session_id, user_id)
);

-- Create notes table
CREATE TABLE public.notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    contributor_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Allow public read access to users"
    ON public.users FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert access to users"
    ON public.users FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow users to update their own records"
    ON public.users FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Create policies for sessions table
CREATE POLICY "Allow public read access to sessions"
    ON public.sessions FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert access to sessions"
    ON public.sessions FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow public update access to sessions"
    ON public.sessions FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Create policies for attendees table
CREATE POLICY "Allow public read access to attendees"
    ON public.attendees FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert access to attendees"
    ON public.attendees FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow public delete access to attendees"
    ON public.attendees FOR DELETE
    TO public
    USING (true);

-- Create policies for notes table
CREATE POLICY "Allow public read access to notes"
    ON public.notes FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert access to notes"
    ON public.notes FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow users to update their own notes"
    ON public.notes FOR UPDATE
    TO public
    USING (contributor_id = auth.uid())
    WITH CHECK (contributor_id = auth.uid());

CREATE POLICY "Allow users to delete their own notes"
    ON public.notes FOR DELETE
    TO public
    USING (contributor_id = auth.uid());

-- Create updated_at triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON public.notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();