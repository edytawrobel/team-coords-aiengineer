import React from 'react';
import { TeamMember as TeamMemberType } from '../types';
import { User } from 'lucide-react';

interface TeamMemberProps {
  member: TeamMemberType;
  showRole?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const TeamMember: React.FC<TeamMemberProps> = ({
  member,
  showRole = false,
  size = 'md',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  const colorClass = `bg-${member.color}-500`;
  const borderClass = `border-${member.color}-500`;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div 
      className={`flex items-center ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div 
        className={`relative flex-shrink-0 ${sizeClasses[size]} rounded-full flex items-center justify-center text-white ${colorClass} border-2 ${borderClass} overflow-hidden`}
      >
        {member.avatar ? (
          <img 
            src={member.avatar} 
            alt={member.name}
            className="w-full h-full object-cover" 
          />
        ) : (
          <span>{getInitials(member.name)}</span>
        )}
      </div>
      
      {(member.name || showRole) && (
        <div className="ml-2">
          {member.name && <p className="font-medium">{member.name}</p>}
          {showRole && member.role && (
            <p className="text-gray-600 text-sm">{member.role}</p>
          )}
        </div>
      )}
    </div>
  );
};