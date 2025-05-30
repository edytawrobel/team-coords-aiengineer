import React, { useState } from 'react';
import { TeamMember as TeamMemberType } from '../types';
import { TeamMember } from './TeamMember';
import { Plus, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface TeamSelectorProps {
  selectedIds?: string[];
  onSelect?: (memberId: string) => void;
  onDeselect?: (memberId: string) => void;
  showAddButton?: boolean;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
  selectedIds = [],
  onSelect,
  onDeselect,
  showAddButton = false,
}) => {
  const { state } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMemberClick = (member: TeamMemberType) => {
    if (selectedIds.includes(member.id)) {
      onDeselect?.(member.id);
    } else {
      onSelect?.(member.id);
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2">
        {selectedIds.length > 0 && (
          <>
            {selectedIds.map((id) => {
              const member = state.team.find((m) => m.id === id);
              if (!member) return null;
              
              return (
                <div key={id} className="relative group">
                  <TeamMember 
                    member={member} 
                    size="md" 
                    onClick={() => handleMemberClick(member)}
                  />
                  {onDeselect && (
                    <button 
                      className="absolute -top-1 -right-1 bg-gray-100 rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeselect(id);
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </>
        )}
        
        {(showAddButton && (!selectedIds.length || onDeselect)) && (
          <button
            className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="absolute z-10 mt-2 p-2 bg-white rounded-md shadow-lg border border-gray-200 w-64">
          <div className="max-h-64 overflow-y-auto">
            {state.team.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-2">No team members yet</p>
            ) : (
              state.team.map((member) => (
                <div 
                  key={member.id}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${
                    selectedIds.includes(member.id) 
                      ? `bg-${member.color}-100` 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleMemberClick(member)}
                >
                  <TeamMember member={member} showRole size="sm" />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};