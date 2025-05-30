import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { SummaryCard } from '../components/SummaryCard';
import { SearchFilter } from '../components/SearchFilter';
import { BookOpen, Filter, Search, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamSelector } from '../components/TeamSelector';

export const KnowledgeBoard: React.FC = () => {
  const { state } = useAppContext();
  const { sessions, team, summaries } = state;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const handleMemberSelect = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };
  
  // Filter and sort summaries
  const filteredSummaries = useMemo(() => {
    let filtered = [...summaries];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(summary => {
        const session = sessions.find(s => s.id === summary.sessionId);
        if (!session) return false;
        
        return (
          session.title.toLowerCase().includes(term) ||
          summary.keyTakeaways.some(t => t.toLowerCase().includes(term)) ||
          summary.actionableInsights.toLowerCase().includes(term) ||
          summary.resources.some(r => r.toLowerCase().includes(term))
        );
      });
    }
    
    // Filter by day
    if (selectedDay) {
      filtered = filtered.filter(summary => {
        const session = sessions.find(s => s.id === summary.sessionId);
        return session && session.day === selectedDay;
      });
    }
    
    // Filter by team members
    if (selectedMembers.length > 0) {
      filtered = filtered.filter(summary => 
        selectedMembers.includes(summary.authorId)
      );
    }
    
    // Sort by creation date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [summaries, sessions, searchTerm, selectedDay, selectedMembers]);
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpen className="mr-2 text-indigo-500" size={24} />
            Knowledge Board
          </h1>
          <p className="text-gray-600">Team insights and summaries from conference sessions</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search summaries, sessions, or keywords..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-400 hover:text-indigo-500"
              >
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Day</label>
                  <select
                    value={selectedDay || ''}
                    onChange={e => setSelectedDay(e.target.value ? parseInt(e.target.value) : null)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="">All Days</option>
                    <option value="1">Day 1 (June 3)</option>
                    <option value="2">Day 2 (June 4)</option>
                    <option value="3">Day 3 (June 5)</option>
                  </select>
                </div>
                
                <div className="flex-grow">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Team Members</label>
                  <TeamSelector 
                    selectedIds={selectedMembers}
                    onSelect={handleMemberSelect}
                    onDeselect={handleMemberSelect}
                    showAddButton
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {summaries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No summaries yet</h3>
          <p className="mt-1 text-gray-500">
            Team members can share session summaries after attending conference sessions.
          </p>
          <div className="mt-6">
            <Link
              to="/sessions"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Calendar size={16} className="mr-2" />
              Browse Sessions
            </Link>
          </div>
        </div>
      ) : (
        <>
          {filteredSummaries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900">No matching summaries</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSummaries.map(summary => {
                const session = sessions.find(s => s.id === summary.sessionId);
                const author = team.find(m => m.id === summary.authorId);
                
                if (!session || !author) return null;
                
                return (
                  <SummaryCard
                    key={summary.id}
                    summary={summary}
                    session={session}
                    author={author}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};