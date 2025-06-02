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
          sessions: state.sessions.filter(s => s.isCustom), // Only save custom sessions
          attendance: state.attendance,
          notes: state.notes
        }
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving state:', error);
  }
};

export const loadState = async (): Promise<AppState | null> => {
  try {
    // Load both app state and team members in parallel
    const [stateResult, teamResult] = await Promise.all([
      supabase
        .from('app_state')
        .select('state')
        .eq('id', 'main')
        .single(),
      supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true })
    ]);

    if (stateResult.error && stateResult.error.code !== 'PGRST116') {
      // PGRST116 means no rows returned - that's okay for first load
      throw stateResult.error;
    }
    if (teamResult.error) throw teamResult.error;

    // Load sessions from the JSON file
    const response = await fetch('/src/data/combined_sessions.json');
    const sessionsData = await response.json();
    
    // Transform the sessions data to match our Session type
    const sessions = sessionsData.map((s: any) => ({
      id: s['Session ID'],
      title: s['Title'],
      description: s['Description'] || '',
      track: s['Assigned Track'] || 'General',
      room: s['Room'],
      day: new Date(s['startsAt']).getDate() - 2, // Convert date to day number (1-3)
      startTime: new Date(s['startsAt']).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }),
      endTime: new Date(s['endsAt']).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }),
      date: new Date(s['startsAt']).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      speaker: {
        id: s['Session ID'] + '-speaker',
        name: s['Speakers'],
        title: '',
        company: s['Companies'],
        bio: '',
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s['Speakers'])}`
      }
    }));

    // Initialize with empty state if no data exists
    const state = stateResult.data?.state || {
      sessions: [],
      attendance: [],
      notes: []
    };

    // Combine built-in sessions with custom sessions
    const allSessions = [
      ...sessions,
      ...(state.sessions || [])
    ];

    return {
      sessions: allSessions,
      attendance: state.attendance || [],
      notes: state.notes || [],
      team: teamResult.data || []
    };
  } catch (error) {
    console.error('Error loading state:', error);
    return {
      sessions: [],
      attendance: [],
      notes: [],
      team: []
    };
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