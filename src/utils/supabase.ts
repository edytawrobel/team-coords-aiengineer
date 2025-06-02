import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Users
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createUser = async (user: Database['public']['Tables']['users']['Insert']) => {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUser = async (user: Database['public']['Tables']['users']['Update']) => {
  const { data, error } = await supabase
    .from('users')
    .update(user)
    .eq('id', user.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Sessions
export const getSessions = async () => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('starts_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createSession = async (session: Database['public']['Tables']['sessions']['Insert']) => {
  const { data, error } = await supabase
    .from('sessions')
    .insert(session)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateSession = async (session: Database['public']['Tables']['sessions']['Update']) => {
  const { data, error } = await supabase
    .from('sessions')
    .update(session)
    .eq('id', session.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Attendees
export const getAttendees = async () => {
  const { data, error } = await supabase
    .from('attendees')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const toggleAttendance = async (sessionId: string, userId: string) => {
  // First try to delete any existing attendance
  const { error: deleteError } = await supabase
    .from('attendees')
    .delete()
    .eq('session_id', sessionId)
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  // If no rows were deleted, create new attendance
  const { data, error: insertError } = await supabase
    .from('attendees')
    .insert({ session_id: sessionId, user_id: userId })
    .select()
    .single();

  if (insertError && insertError.code !== '23505') throw insertError; // Ignore unique constraint violations
  return data;
};

// Notes
export const getNotes = async () => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createNote = async (note: Database['public']['Tables']['notes']['Insert']) => {
  const { data, error } = await supabase
    .from('notes')
    .insert(note)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateNote = async (note: Database['public']['Tables']['notes']['Update']) => {
  const { data, error } = await supabase
    .from('notes')
    .update(note)
    .eq('id', note.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteNote = async (id: string) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};