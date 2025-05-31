import { createClient } from '@supabase/supabase-js';
import type { AppState } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveState = async (state: AppState) => {
  try {
    const { error } = await supabase
      .from('app_state')
      .upsert({ 
        id: 'main', 
        state
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving state:', error);
  }
};

export const loadState = async (): Promise<AppState | null> => {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('state')
      .eq('id', 'main')
      .limit(1);
    
    if (error) throw error;
    return data && data.length > 0 ? data[0].state : null;
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
};