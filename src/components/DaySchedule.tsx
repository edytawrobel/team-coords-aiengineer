import React, { useMemo } from 'react';
import { Session, TeamMember } from '../types';
import { SessionCard } from './SessionCard';
import { getMembersAttendingSession, doSessionsOverlap } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';
import { Users } from 'lucide-react';

interface DayScheduleProps {
  day: number;
  sessions: Session[];
  currentMemberId?: string;
  onSessionClick?: (session: Session) => void;
  onToggleAttendance?: (sessionId: string, memberId: string) => void;
}

export const DaySchedule: React.FC<DayScheduleProps> = ({
  day,
  sessions,
  currentMemberId,
  onSessionClick,
  onToggleAttendance,
}) => {
  const { state } = useAppContext();
  const [showOnlyTeamSessions, setShowOnlyTeamSessions] = React.useState(false);

  const dayName = useMemo(() => {
    const days = ['Tuesday', 'Wednesday', 'Thursday'];
    return days[day - 1] || `Day ${day}`;
  }, [day]);

  // Check for session conflicts
  const getSessionConflicts = (session: Session, memberAttendance: Session[]): boolean => {
    return memberAttendance.some(
      attendedSession => 
        attendedSession.id !== session.id && 
        doSessionsOverlap(session, attendedSession)
    );
  };

  // Get all sessions the current member is attending
  const currentMemberSessions = useMemo(() => {
    if (!currentMemberId) return [];
    return sessions.filter(session =>
      state.attendance.some(a => 
        a.sessionId === session.id && 
        a.memberId === currentMemberId
      )
    );
  }, [sessions, currentMemberId, state.attendance]);

  // Group sessions by time slot with overlap information
  const sessionsByTime = useMemo(() => {
    const timeSlots: { [key: string]: Session[] } = {};
    
    const filteredSessions = sessions
      .filter(session => session.day === day)
      .filter(session => {
        if (!showOnlyTeamSessions) return true;
        const attendees = getMembersAttendingSession(session.id, state.attendance, state.team);
        return attendees.length > 0;
      });
    
    filteredSessions.forEach(session => {
      const timeKey = `${session.startTime}-${session.endTime}`;
      if (!timeSlots[timeKey]) {
        timeSlots[timeKey] = [];
      }
      timeSlots[timeKey].push(session);
    });
    
    return Object.entries(timeSlots)
      .sort(([timeA], [timeB]) => {
        const [startA] = timeA.split('-');
        const [startB] = timeB.split('-');
        return startA.localeCompare(startB);
      });
  }, [sessions, day, state.attendance, state.team, showOnlyTeamSessions]);

  if (sessionsByTime.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">
          {showOnlyTeamSessions 
            ? "No sessions with team attendance for this day" 
            : "No sessions available for this day"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="sticky top-0 bg-white p-4 shadow-sm z-10 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {dayName} (June {day + 2}, 2025)
          </h2>
          
          <button
            onClick={() => setShowOnlyTeamSessions(!showOnlyTeamSessions)}
            className={`
              flex items-center px-3 py-2 rounded-lg text-sm font-medium
              ${showOnlyTeamSessions ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-700'}
            `}
          >
            <Users size={16} className="mr-2" />
            {showOnlyTeamSessions ? 'All Sessions' : 'Team Sessions'}
          </button>
        </div>
      </div>
      
      {sessionsByTime.map(([timeSlot, slotSessions]) => {
        const [startTime, endTime] = timeSlot.split('-');
        
        return (
          <div key={timeSlot} className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700 px-4 sticky top-24 bg-white py-2 z-10">
              {startTime} - {endTime}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {slotSessions.map(session => {
                const attendees = getMembersAttendingSession(
                  session.id,
                  state.attendance,
                  state.team
                );
                
                const hasConflict = currentMemberId && 
                  getSessionConflicts(session, currentMemberSessions);
                
                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    attendees={attendees}
                    currentMemberId={currentMemberId}
                    onClick={() => onSessionClick?.(session)}
                    onToggleAttendance={(memberId) => 
                      onToggleAttendance?.(session.id, memberId)
                    }
                    hasConflict={hasConflict}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};