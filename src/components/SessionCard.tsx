import React from 'react';
import { Session, TeamMember as TeamMemberType } from '../types';
import { formatTime } from '../utils/helpers';
import { TeamMember } from './TeamMember';
import { useAppContext } from '../context/AppContext';
import { Calendar, Clock, MapPin, Users, UserPlus, UserMinus, AlertTriangle } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  attendees?: TeamMemberType[];
  isSelected?: boolean;
  onClick?: () => void;
  onToggleAttendance?: (memberId: string) => void;
  currentMemberId?: string;
  hasConflict?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  attendees = [],
  isSelected = false,
  onClick,
  onToggleAttendance,
  currentMemberId,
  hasConflict = false,
}) => {
  const { state } = useAppContext();
  const [showAttendees, setShowAttendees] = React.useState(false);
  
  const isAttending = currentMemberId ? 
    attendees.some(member => member.id === currentMemberId) : 
    false;

  const toggleAttendanceStatus = () => {
    if (currentMemberId && onToggleAttendance) {
      onToggleAttendance(currentMemberId);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Get track color
  const getTrackColor = () => {
    if (session.isCustom) {
      return 'bg-purple-100 text-purple-800 border-purple-500';
    }
    
    switch (session.track) {
      case 'Main Track':
        return 'bg-indigo-100 text-indigo-800 border-indigo-500';
      case 'Technical':
        return 'bg-emerald-100 text-emerald-800 border-emerald-500';
      case 'Ethics':
        return 'bg-purple-100 text-purple-800 border-purple-500';
      case 'Infrastructure':
        return 'bg-amber-100 text-amber-800 border-amber-500';
      case 'Business':
        return 'bg-sky-100 text-sky-800 border-sky-500';
      case 'Future':
        return 'bg-rose-100 text-rose-800 border-rose-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  const creator = session.createdBy ? state.team.find(m => m.id === session.createdBy) : null;

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm overflow-hidden border-l-4 transition-all
        hover:shadow-md relative
        ${isSelected ? 'ring-2 ring-indigo-400 border-l-indigo-500' : `border-l-${getTrackColor()}`}
        ${hasConflict ? 'ring-1 ring-amber-300' : ''}
        ${session.isCustom ? 'bg-purple-50/20' : ''}
      `}
      onClick={handleCardClick}
    >
      {hasConflict && (
        <div className="absolute top-2 right-2 text-amber-500 flex items-center bg-amber-50 rounded-full px-2 py-1 text-xs">
          <AlertTriangle size={12} className="mr-1" />
          Time Conflict
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getTrackColor()}`}>
            {session.isCustom ? 'Custom Session' : session.track}
          </span>
          <span className="text-sm text-gray-500 font-medium">Day {session.day}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {session.title}
        </h3>
        
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="font-medium">{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-gray-400 flex-shrink-0" />
            <span>{session.room}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {session.speaker.image ? (
              <img 
                src={session.speaker.image} 
                alt={session.speaker.name}
                className="h-12 w-12 rounded-full mr-3 border-2 border-white shadow-sm" 
              />
            ) : (
              <div className="h-12 w-12 rounded-full mr-3 bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-white shadow-sm">
                {getInitials(session.speaker.name)}
              </div>
            )}
            <div>
              <span className="block font-medium text-gray-900">{session.speaker.name}</span>
              <span className="text-sm text-gray-500">
                {session.speaker.title}
                {session.speaker.company && ` • ${session.speaker.company}`}
              </span>
            </div>
          </div>
        </div>
        
        {session.isCustom && creator && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              Added by <span className="font-medium">{creator.name}</span>
            </p>
          </div>
        )}
        
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Users size={16} className="text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {attendees.length} teammate{attendees.length !== 1 ? 's' : ''} attending
              </span>
            </div>
            {attendees.length > 0 && (
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAttendees(!showAttendees);
                }}
              >
                View All
              </button>
            )}
          </div>

          {attendees.length > 0 && (
            <div className="flex -space-x-2 mb-4">
              {attendees.slice(0, 5).map(member => (
                <div
                  key={member.id}
                  className={`inline-block h-8 w-8 rounded-full ring-2 ring-white bg-${member.color}-500 flex items-center justify-center text-sm text-white font-bold`}
                  title={member.name}
                >
                  {getInitials(member.name)}
                </div>
              ))}
              {attendees.length > 5 && (
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-400 flex items-center justify-center text-sm text-white font-bold">
                  +{attendees.length - 5}
                </div>
              )}
            </div>
          )}
          
          {showAttendees && attendees.length > 0 && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-20">
              <h4 className="font-medium mb-2 text-gray-900">Attending this session:</h4>
              <div className="space-y-2">
                {attendees.map(member => (
                  <TeamMember 
                    key={member.id} 
                    member={member} 
                    showRole 
                    size="sm" 
                  />
                ))}
              </div>
            </div>
          )}
          
          {currentMemberId && onToggleAttendance && (
            <button
              className={`
                w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors
                flex items-center justify-center
                ${isAttending
                  ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }
                ${hasConflict ? 'border border-amber-300' : ''}
              `}
              onClick={(e) => {
                e.stopPropagation();
                toggleAttendanceStatus();
              }}
            >
              {isAttending ? (
                <>
                  <UserMinus size={16} className="mr-2" />
                  Remove from my schedule
                </>
              ) : (
                <>
                  <UserPlus size={16} className="mr-2" />
                  Add to my schedule
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};