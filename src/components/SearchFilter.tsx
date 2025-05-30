import React, { useState, useEffect } from 'react';
import { Day, Session } from '../types';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  sessions: Session[];
  onFilterChange: (filteredSessions: Session[]) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ sessions, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique tracks and rooms for filter options
  const tracks = [...new Set(sessions.map(session => session.track))].sort();
  const rooms = [...new Set(sessions.map(session => session.room))].sort();
  
  useEffect(() => {
    // Apply filters
    let filtered = [...sessions];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        session => 
          session.title.toLowerCase().includes(term) || 
          session.description.toLowerCase().includes(term) || 
          session.speaker.name.toLowerCase().includes(term)
      );
    }
    
    if (selectedDay) {
      filtered = filtered.filter(session => session.day === selectedDay);
    }
    
    if (selectedTrack) {
      filtered = filtered.filter(session => session.track === selectedTrack);
    }
    
    if (selectedRoom) {
      filtered = filtered.filter(session => session.room === selectedRoom);
    }
    
    onFilterChange(filtered);
  }, [searchTerm, selectedDay, selectedTrack, selectedRoom, sessions, onFilterChange]);
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDay(null);
    setSelectedTrack(null);
    setSelectedRoom(null);
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search sessions, speakers, or topics..."
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
        <div className="mt-3 border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Filters</h3>
            {(selectedDay || selectedTrack || selectedRoom) && (
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <X size={14} className="mr-1" /> Clear filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Day</label>
              <select
                value={selectedDay || ''}
                onChange={e => setSelectedDay(e.target.value ? parseInt(e.target.value) as Day : null)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">All Days</option>
                <option value="1">Day 1 (June 3)</option>
                <option value="2">Day 2 (June 4)</option>
                <option value="3">Day 3 (June 5)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Track</label>
              <select
                value={selectedTrack || ''}
                onChange={e => setSelectedTrack(e.target.value || null)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">All Tracks</option>
                {tracks.map(track => (
                  <option key={track} value={track}>{track}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Room</label>
              <select
                value={selectedRoom || ''}
                onChange={e => setSelectedRoom(e.target.value || null)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">All Rooms</option>
                {rooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};