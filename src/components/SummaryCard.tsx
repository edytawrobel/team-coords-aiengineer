import React from 'react';
import { Summary, Session, TeamMember } from '../types';
import { TeamMember as TeamMemberDisplay } from './TeamMember';
import { Star, Edit, Trash2 } from 'lucide-react';

interface SummaryCardProps {
  summary: Summary;
  session: Session;
  author: TeamMember;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  summary,
  session,
  author,
  onEdit,
  onDelete,
}) => {
  const createdDate = new Date(summary.createdAt).toLocaleDateString();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{session.title}</h3>
            <p className="text-sm text-gray-600">
              {session.date} • {session.startTime}-{session.endTime}
            </p>
          </div>
          
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={16} 
                className={`${summary.rating >= star ? 'text-amber-400' : 'text-gray-300'}`}
                fill={summary.rating >= star ? 'currentColor' : 'none'} 
              />
            ))}
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Takeaways</h4>
          <ul className="list-disc pl-5 space-y-1">
            {summary.keyTakeaways.map((takeaway, index) => (
              <li key={index} className="text-sm text-gray-600">{takeaway}</li>
            ))}
          </ul>
        </div>
        
        {summary.actionableInsights && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Actionable Insights</h4>
            <p className="text-sm text-gray-600">{summary.actionableInsights}</p>
          </div>
        )}
        
        {summary.resources.length > 0 && summary.resources[0] !== '' && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Resources Mentioned</h4>
            <ul className="list-disc pl-5 space-y-1">
              {summary.resources.map((resource, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {resource.startsWith('http') ? (
                    <a 
                      href={resource} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-600 hover:underline"
                    >
                      {resource}
                    </a>
                  ) : (
                    resource
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {summary.speakerContact && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Speaker Contact</h4>
            <p className="text-sm text-gray-600">{summary.speakerContact}</p>
          </div>
        )}
        
        <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between items-center">
          <div className="flex items-center">
            <TeamMemberDisplay member={author} size="sm" />
            <span className="text-xs text-gray-500 ml-2">
              Shared on {createdDate}
            </span>
          </div>
          
          <div className="flex space-x-2">
            {onEdit && (
              <button 
                onClick={onEdit}
                className="p-1 text-gray-400 hover:text-indigo-600"
                title="Edit summary"
              >
                <Edit size={16} />
              </button>
            )}
            
            {onDelete && (
              <button 
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Delete summary"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};