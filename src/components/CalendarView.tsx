import React from 'react';
import { Session } from '../types';
import { formatTime } from '../utils/helpers';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getMembersAttendingSession } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

interface CalendarViewProps {
  sessions: Session[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ sessions }) => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleSessionClick = (session: Session) => {
    navigate(`/sessions?id=${session.id}`);
  };
  
  // Group sessions by day and time slot
  const sessionsByDay = React.useMemo(() => {
    const days = [{}, {}, {}] as { [key: string]: Session[] }[];
    
    sessions.forEach(session => {
      const dayIndex = session.day - 1;
      if (dayIndex >= 0 && dayIndex < 3) {
        const timeKey = `${session.startTime}-${session.endTime}`;
        if (!days[dayIndex][timeKey]) {
          days[dayIndex][timeKey] = [];
        }
        days[dayIndex][timeKey].push(session);
      }
    });
    
    return days;
  }, [sessions]);

  // Get all unique time slots across all days
  const timeSlots = React.useMemo(() => {
    const slots = new Set<string>();
    sessions.forEach(session => {
      slots.add(`${session.startTime}-${session.endTime}`);
    });
    return Array.from(slots).sort((a, b) => {
      const [startA] = a.split('-');
      const [startB] = b.split('-');
      return startA.localeCompare(startB);
    });
  }, [sessions]);

  const days = ['Tuesday, June 3', 'Wednesday, June 4', 'Thursday, June 5'];

  // Get track color
  const getTrackColor = (track: string): string => {
    switch (track) {
      case 'Main Track':
        return 'border-l-indigo-500 bg-indigo-50/50';
      case 'Technical':
        return 'border-l-emerald-500 bg-emerald-50/50';
      case 'Ethics':
        return 'border-l-purple-500 bg-purple-50/50';
      case 'Infrastructure':
        return 'border-l-amber-500 bg-amber-50/50';
      case 'Business':
        return 'border-l-sky-500 bg-sky-50/50';
      case 'Future':
        return 'border-l-rose-500 bg-rose-50/50';
      default:
        return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  return (
    <div className="overflow-x-auto pb-6">
      <div className="min-w-[1200px]">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {days.map((day, index) => (
            <div
              key={day}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <Calendar className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-center text-lg">{day}</h3>
              <p className="text-sm text-gray-600 text-center mt-1">Day {index + 1}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {days.map((day, dayIndex) => (
            <div key={day} className="space-y-6">
              {timeSlots.map(timeSlot => {
                const daySessions = sessionsByDay[dayIndex][timeSlot] || [];
                if (daySessions.length === 0) return null;

                const [startTime, endTime] = timeSlot.split('-');

                return (
                  <div key={timeSlot} className="space-y-3">
                    <div className="flex items-center text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm">
                      <Clock size={16} className="mr-2 text-indigo-500" />
                      {formatTime(startTime)} - {formatTime(endTime)}
                    </div>
                    
                    <div className="space-y-3">
                      {daySessions.map(session => {
                        const attendees = getMembersAttendingSession(
                          session.id,
                          state.attendance,
                          state.team
                        );

                        return (
                          <div
                            key={session.id}
                            onClick={() => handleSessionClick(session)}
                            className={`
                              p-4 rounded-lg border-l-4 bg-white shadow-sm
                              hover:shadow-md transition-all cursor-pointer
                              ${getTrackColor(session.track)}
                            `}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <span className={`
                                inline-block px-3 py-1 text-xs font-medium rounded-full
                                ${session.track === 'Main Track' ? 'bg-indigo-100 text-indigo-800' : 'bg-white/75'}
                              `}>
                                {session.track}
                              </span>
                              
                              {attendees.length > 0 && (
                                <div className="flex items-center text-xs text-gray-600">
                                  <Users size={12} className="mr-1" />
                                  {attendees.length}
                                </div>
                              )}
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                              {session.title}
                            </h4>
                            
                            <div className="flex items-center text-sm text-gray-600 mb-3">
                              <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                              <span className="truncate">{session.room}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <img
                                src={session.speaker.image}
                                alt={session.speaker.name}
                                className="w-8 h-8 rounded-full mr-2 border-2 border-white shadow-sm"
                              />
                              <div>
                                <span className="text-sm font-medium text-gray-900 block">
                                  {session.speaker.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {session.speaker.title}
                                </span>
                              </div>
                            </div>

                            {attendees.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex -space-x-2">
                                  {attendees.slice(0, 5).map(member => (
                                    <div
                                      key={member.id}
                                      className={`
                                        inline-block h-6 w-6 rounded-full 
                                        ring-2 ring-white 
                                        bg-${member.color}-500 
                                        flex items-center justify-center 
                                        text-xs text-white font-bold
                                      `}
                                      title={member.name}
                                    >
                                      {getInitials(member.name)}
                                    </div>
                                  ))}
                                  {attendees.length > 5 && (
                                    <div className="
                                      inline-block h-6 w-6 rounded-full 
                                      ring-2 ring-white bg-gray-400 
                                      flex items-center justify-center 
                                      text-xs text-white font-bold
                                    ">
                                      +{attendees.length - 5}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};