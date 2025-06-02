import { createClient } from '@supabase/supabase-js';
import type { AppState, TeamMember } from '../types';

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
        state: {
          ...state,
          team: [] // Team is now stored separately
        }
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving state:', error);
  }
};

export const loadState = async (): Promise<AppState | null> => {
  try {
    const [stateResult, teamResult] = await Promise.all([
      supabase
        .from('app_state')
        .select('state')
        .eq('id', 'main')
        .limit(1)
        .single(),
      supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true })
    ]);

    if (stateResult.error) throw stateResult.error;
    if (teamResult.error) throw teamResult.error;

    const state = stateResult.data?.state || {};
    return {
      ...state,
      team: teamResult.data || [],
      attendance: state.attendance || [],
      sessions: state.sessions || [],
      notes: state.notes || []
    };
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
};

export const saveTeamMember = async (member: TeamMember) => {
  try {
    const { error } = await supabase
      .from('team_members')
      .upsert({
        id: member.id,
        name: member.name,
        role: member.role,
        avatar: member.avatar,
        color: member.color
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving team member:', error);
    throw error;
  }
};

export const deleteTeamMember = async (id: string) => {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};