import { createClient } from '@supabase/supabase-js';
import type { AppState, TeamMember, Note, Attendance } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveState = async (state: AppState) => {
  try {
    // Save custom sessions to app_state
    await supabase
      .from('app_state')
      .upsert({ 
        id: 'main', 
        state: {
          sessions: state.sessions.filter(s => s.isCustom)
        }
      });

    // Save notes
    const notesPromises = state.notes.map(note => 
      supabase
        .from('notes')
        .upsert({
          id: note.id,
          session_id: note.sessionId,
          member_id: note.memberId,
          content: note.content,
          created_at: note.createdAt,
          updated_at: note.updatedAt
        })
    );

    // Save attendance
    const attendancePromises = state.attendance.map(record =>
      supabase
        .from('attendance')
        .upsert({
          session_id: record.sessionId,
          member_id: record.memberId
        })
    );

    await Promise.all([...notesPromises, ...attendancePromises]);
  } catch (error) {
    console.error('Error saving state:', error);
    throw error;
  }
};

export const loadState = async (): Promise<AppState | null> => {
  try {
    // Load all data in parallel
    const [stateResult, teamResult, notesResult, attendanceResult] = await Promise.all([
      supabase
        .from('app_state')
        .select('state')
        .eq('id', 'main')
        .single(),
      supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true }),
      supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: true }),
      supabase
        .from('attendance')
        .select('*')
    ]);

    if (stateResult.error && stateResult.error.code !== 'PGRST116') {
      throw stateResult.error;
    }
    if (teamResult.error) throw teamResult.error;
    if (notesResult.error) throw notesResult.error;
    if (attendanceResult.error) throw attendanceResult.error;

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

    // Transform notes from database format to app format
    const notes = notesResult.data?.map(note => ({
      id: note.id,
      sessionId: note.session_id,
      memberId: note.member_id,
      content: note.content,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    })) || [];

    // Transform attendance from database format to app format
    const attendance = attendanceResult.data?.map(record => ({
      sessionId: record.session_id,
      memberId: record.member_id
    })) || [];

    // Combine built-in sessions with custom sessions
    const customSessions = stateResult.data?.state?.sessions || [];
    const allSessions = [...sessions, ...customSessions];

    return {
      sessions: allSessions,
      team: teamResult.data || [],
      notes,
      attendance
    };
  } catch (error) {
    console.error('Error loading state:', error);
    return {
      sessions: [],
      team: [],
      notes: [],
      attendance: []
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