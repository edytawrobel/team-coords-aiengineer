import { Session } from '../types';
import { supabase } from './supabase';

export const fetchSessions = async (): Promise<Session[]> => {
  try {
    // Fetch conference sessions from JSON
    const response = await fetch('/src/data/combined_sessions.json');
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }
    const jsonData = await response.json();
    
    // Transform JSON data
    const conferenceSessions = jsonData.map((item: any) => ({
      id: item['Session ID'],
      title: item.Title,
      description: item.Description,
      track: item['Assigned Track'] || 'General',
      room: item.Room,
      day: new Date(item.startsAt).getDate() - 2, // Convert to day 1, 2, or 3
      startTime: new Date(item.startsAt).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      endTime: new Date(item.endsAt).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      date: new Date(item.startsAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      speaker: {
        id: item['Session ID'] + '_speaker',
        name: item.Speakers,
        bio: '',
        company: item.Companies,
        title: '',
        image: `https://api.dicebear.com/7.x/initials/jpg?seed=${encodeURIComponent(item.Speakers)}`
      },
      isCustom: false
    }));

    // Fetch custom sessions from Supabase
    const { data: customSessions, error } = await supabase
      .from('sessions')
      .select('*')
      .order('starts_at', { ascending: true });

    if (error) throw error;

    // Transform Supabase data to match Session type
    const transformedCustomSessions = (customSessions || []).map(session => ({
      id: session.id,
      title: session.title,
      description: session.description || '',
      track: session.assigned_track || 'Custom Session',
      room: session.room,
      day: new Date(session.starts_at).getDate() - 2,
      startTime: new Date(session.starts_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      endTime: new Date(session.ends_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      date: new Date(session.starts_at).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      speaker: {
        id: session.id + '_speaker',
        name: session.speakers?.[0] || 'TBA',
        bio: '',
        company: session.companies?.[0] || '',
        title: session.session_format || '',
        image: `https://api.dicebear.com/7.x/initials/jpg?seed=${encodeURIComponent(session.speakers?.[0] || 'TBA')}`
      },
      isCustom: true
    }));

    // Combine both sources
    return [...conferenceSessions, ...transformedCustomSessions];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};