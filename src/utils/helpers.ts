import { Attendance, Session, Summary, TeamMember } from '../types';
import { format, parseISO } from 'date-fns';

// Format a date string
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
  } catch (error) {
    console.error('Invalid date format:', dateString);
    return dateString;
  }
};

// Format a time string (24h format) to 12h format
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Get members attending a session
export const getMembersAttendingSession = (
  sessionId: string,
  attendance: Attendance[],
  team: TeamMember[]
): TeamMember[] => {
  const memberIds = attendance
    .filter((a) => a.sessionId === sessionId)
    .map((a) => a.memberId);
  return team.filter((member) => memberIds.includes(member.id));
};

// Get sessions a member is attending
export const getSessionsForMember = (
  memberId: string,
  attendance: Attendance[],
  sessions: Session[]
): Session[] => {
  const sessionIds = attendance
    .filter((a) => a.memberId === memberId)
    .map((a) => a.sessionId);
  return sessions.filter((session) => sessionIds.includes(session.id));
};

// Check if sessions overlap in time
export const doSessionsOverlap = (session1: Session, session2: Session): boolean => {
  if (session1.day !== session2.day) return false;

  const start1 = timeToMinutes(session1.startTime);
  const end1 = timeToMinutes(session1.endTime);
  const start2 = timeToMinutes(session2.startTime);
  const end2 = timeToMinutes(session2.endTime);

  return (start1 < end2 && start2 < end1);
};

// Convert time (HH:MM) to minutes for easier comparison
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Get summaries for a specific session
export const getSummariesForSession = (
  sessionId: string,
  summaries: Summary[]
): Summary[] => {
  return summaries.filter((summary) => summary.sessionId === sessionId);
};

// Get sessions with most/least team coverage
export const getSessionsByTeamCoverage = (
  sessions: Session[],
  attendance: Attendance[]
): { mostCovered: Session[], leastCovered: Session[] } => {
  const sessionCounts = sessions.map(session => {
    const count = attendance.filter(a => a.sessionId === session.id).length;
    return { session, count };
  });
  
  sessionCounts.sort((a, b) => b.count - a.count);
  
  const mostCovered = sessionCounts.slice(0, 3).map(item => item.session);
  const leastCovered = sessionCounts
    .filter(item => item.count > 0) // Only include sessions that have at least one attendee
    .slice(-3)
    .map(item => item.session);
  
  return { mostCovered, leastCovered };
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};