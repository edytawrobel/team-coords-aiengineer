import { createClient } from '@supabase/supabase-js';
import type { AppState } from '../types';

const supabaseUrl = 'https://etfwlzsdlddbswulqpqk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0ZndsenNkbGRkYnN3dWxxcHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjY3NjksImV4cCI6MjA2NDIwMjc2OX0.ObIZZWz_8r1vENovb_CJu-OaZjhb6c-jFhP2GCuaMYs';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveState = async (state: AppState) => {
  try {
    const { error } = await supabase
      .from('app_state')
      .upsert({ 
        id: 'main', 
        state,
        updated_at: new Date().toISOString()
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