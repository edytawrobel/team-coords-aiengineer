import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Session, TeamMember } from '../types';
import { getSessionsForMember, getMembersAttendingSession } from '../utils/helpers';
import { AlarmClock, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DailyBriefingProps {
  day: number;
  onViewSession?: (session: Session) => void;
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({ day, onViewSession }) => {
  const { state } = useAppContext();
  const { sessions, team, attendance } = state;
  const [showModal, setShowModal] = useState(false);
  
  const dayDate = useMemo(() => {
    const dates = ['June 3, 2025', 'June 4, 2025', 'June 5, 2025'];
    return dates[day - 1] || `Day ${day}`;
  }, [day]);
  
  const daySessions = useMemo(() => 
    sessions.filter(session => session.day === day),
    [sessions, day]
  );
  
  const teamAttendance = useMemo(() => {
    const sessionsWithAttendees = daySessions.map(session => {
      const attendees = getMembersAttendingSession(session.id, attendance, team);
      return { session, attendees };
    }).filter(item => item.attendees.length > 0);
    
    return sessionsWithAttendees.sort((a, b) => 
      a.session.startTime.localeCompare(b.session.startTime)
    );
  }, [daySessions, attendance, team]);
  
  const popularSessions = useMemo(() => {
    return [...teamAttendance]
      .sort((a, b) => b.attendees.length - a.attendees.length)
      .slice(0, 3);
  }, [teamAttendance]);
  
  const memberSchedules = useMemo(() => {
    return team.map(member => {
      const memberSessions = getSessionsForMember(member.id, attendance, daySessions);
      return {
        member,
        sessions: memberSessions.sort((a, b) => a.startTime.localeCompare(b.startTime)),
      };
    }).filter(item => item.sessions.length > 0);
  }, [team, attendance, daySessions]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-2 text-indigo-500" size={24} />
          Daily Briefing: {dayDate}
        </h2>
      </div>
      
      {teamAttendance.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
          <h3 className="text-lg font-medium text-gray-800">No team plans for {dayDate}</h3>
          <p className="text-gray-500 mt-1">
            Your team hasn't added any sessions to their schedule for this day yet.
          </p>
        </div>
      ) : (
        <>
          {popularSessions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                <Users className="mr-2 text-indigo-500\" size={18} />
                Team Hotspots
              </h3>
              <div className="space-y-3">
                {popularSessions.map(({ session, attendees }) => (
                  <div 
                    key={session.id}
                    className="p-3 bg-indigo-50 rounded-md cursor-pointer hover:bg-indigo-100 transition-colors"
                    onClick={() => onViewSession?.(session)}
                  >
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-indigo-800">
                        {session.startTime} - {session.endTime}
                      </span>
                      <span className="text-sm text-indigo-600">
                        {attendees.length} team members
                      </span>
                    </div>
                    <p className="font-medium mt-1">{session.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{session.room}</p>
                    <div className="mt-2 flex -space-x-2 overflow-hidden">
                      {attendees.slice(0, 5).map(member => (
                        <div
                          key={member.id}
                          className={`inline-block h-6 w-6 rounded-full ring-2 ring-white bg-${member.color}-500 flex items-center justify-center text-xs text-white font-bold`}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {attendees.length > 5 && (
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-400 flex items-center justify-center text-xs text-white font-bold">
                          +{attendees.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
              <AlarmClock className="mr-2 text-indigo-500" size={18} />
              Team Member Schedules
            </h3>
            <div className="space-y-4">
              {memberSchedules.map(({ member, sessions }) => (
                <div key={member.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center mb-2">
                    <div className={`w-2 h-2 rounded-full bg-${member.color}-500 mr-2`}></div>
                    <span className="font-medium">{member.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({sessions.length} sessions)</span>
                  </div>
                  <div className="pl-4 space-y-2 text-sm">
                    {sessions.map(session => (
                      <div 
                        key={session.id} 
                        className="cursor-pointer hover:text-indigo-600"
                        onClick={() => onViewSession?.(session)}
                      >
                        <span className="font-medium">{session.startTime} - {session.endTime}</span>:{' '}
                        {session.title} ({session.room})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};