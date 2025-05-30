import { createClient } from '@supabase/supabase-js';
import type { AppState } from '../types';

const supabaseUrl = 'https://etfwlzsdlddbswulqpqk.supabase.co';
const supabaseKey = 'your-supabase-anon-key'; // TODO: Replace with actual anon key

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveState = async (state: AppState) => {
  try {
    const { error } = await supabase
      .from('app_state')
      .upsert({ id: 'main', state });
    
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
      .single();
    
    if (error) throw error;
    return data?.state || null;
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
};