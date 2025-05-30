import React from 'react';
import { useAppContext } from '../context/AppContext';
import { getSessionsByTeamCoverage, getMembersAttendingSession } from '../utils/helpers';
import { Users, UserMinus, UserCheck } from 'lucide-react';

interface OverlapAnalysisProps {
  onViewSession?: (sessionId: string) => void;
}

export const OverlapAnalysis: React.FC<OverlapAnalysisProps> = ({ onViewSession }) => {
  const { state } = useAppContext();
  const { sessions, attendance, team } = state;
  
  // Check if any sessions have attendees
  const hasAttendance = attendance.length > 0;
  
  // Get most and least covered sessions only if there's attendance
  const { mostCovered, leastCovered } = hasAttendance 
    ? getSessionsByTeamCoverage(sessions, attendance)
    : { mostCovered: [], leastCovered: [] };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Team Coverage Analysis</h2>
      
      {!hasAttendance ? (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Session Data Yet</h3>
          <p className="text-gray-600">
            Team coverage analysis will appear here once team members start selecting sessions to attend.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="flex items-center text-md font-semibold text-gray-700 mb-3">
              <UserCheck className="mr-2 text-green-500" size={18} />
              Most Covered Sessions
            </h3>
            
            <div className="space-y-3">
              {mostCovered.map(session => {
                const attendees = getMembersAttendingSession(session.id, attendance, team);
                return (
                  <div 
                    key={session.id}
                    className="p-3 bg-green-50 rounded-md cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => onViewSession?.(session.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Day {session.day} • {session.startTime}-{session.endTime} • {session.room}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {attendees.length} attending
                      </span>
                    </div>
                    
                    <div className="mt-2 flex -space-x-2 overflow-hidden">
                      {attendees.map(member => (
                        <div
                          key={member.id}
                          className={`inline-block h-6 w-6 rounded-full ring-2 ring-white bg-${member.color}-500 flex items-center justify-center text-xs text-white font-bold`}
                        >
                          {getInitials(member.name)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="flex items-center text-md font-semibold text-gray-700 mb-3">
              <UserMinus className="mr-2 text-amber-500" size={18} />
              Least Covered Sessions
            </h3>
            
            <div className="space-y-3">
              {leastCovered.map(session => {
                const attendees = getMembersAttendingSession(session.id, attendance, team);
                return (
                  <div 
                    key={session.id}
                    className="p-3 bg-amber-50 rounded-md cursor-pointer hover:bg-amber-100 transition-colors"
                    onClick={() => onViewSession?.(session.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Day {session.day} • {session.startTime}-{session.endTime} • {session.room}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {attendees.length} attending
                      </span>
                    </div>
                    
                    <div className="mt-2 flex -space-x-2 overflow-hidden">
                      {attendees.map(member => (
                        <div
                          key={member.id}
                          className={`inline-block h-6 w-6 rounded-full ring-2 ring-white bg-${member.color}-500 flex items-center justify-center text-xs text-white font-bold`}
                        >
                          {getInitials(member.name)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};