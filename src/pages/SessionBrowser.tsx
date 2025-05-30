import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Session, Attendance } from '../types';
import { DaySchedule } from '../components/DaySchedule';
import { CalendarView } from '../components/CalendarView';
import { SearchFilter } from '../components/SearchFilter';
import { TeamSelector } from '../components/TeamSelector';
import { Calendar, Filter, User, UserPlus, GridIcon, ListIcon as ListIcon, Plus, Trash2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SummaryForm } from '../components/SummaryForm';
import { SummaryCard } from '../components/SummaryCard';
import { getMembersAttendingSession, getSummariesForSession } from '../utils/helpers';

export const SessionBrowser: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { sessions, team, attendance, summaries } = state;
  const location = useLocation();
  const navigate = useNavigate();
  
  const [filteredSessions, setFilteredSessions] = useState<Session[]>(sessions);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [isAddingSummary, setIsAddingSummary] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const dayParam = searchParams.get('day');
    const sessionId = searchParams.get('id');
    const view = searchParams.get('view');
    
    if (dayParam) {
      setActiveDay(parseInt(dayParam));
    }
    
    if (sessionId) {
      setSelectedSessionId(sessionId);
    }

    if (view === 'calendar') {
      setViewMode('calendar');
    }
  }, [location]);
  
  const handleSessionClick = (session: Session) => {
    setSelectedSessionId(session.id === selectedSessionId ? null : session.id);
    
    const searchParams = new URLSearchParams();
    searchParams.set('day', session.day.toString());
    if (session.id !== selectedSessionId) {
      searchParams.set('id', session.id);
    }
    searchParams.set('view', viewMode);
    navigate(`/sessions?${searchParams.toString()}`, { replace: true });
  };
  
  const handleToggleAttendance = (sessionId: string, memberId: string) => {
    if (!memberId) return;
    
    const attendance: Attendance = {
      sessionId,
      memberId,
    };
    
    dispatch({ type: 'TOGGLE_ATTENDANCE', payload: attendance });
  };
  
  const handleDayChange = (day: number) => {
    setActiveDay(day);
    setSelectedSessionId(null);
    
    const searchParams = new URLSearchParams();
    searchParams.set('day', day.toString());
    searchParams.set('view', viewMode);
    navigate(`/sessions?${searchParams.toString()}`, { replace: true });
  };

  const handleViewModeChange = (mode: 'list' | 'calendar') => {
    setViewMode(mode);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('view', mode);
    navigate(`/sessions?${searchParams.toString()}`, { replace: true });
  };
  
  const handleSaveSummary = (summary: any) => {
    dispatch({ type: 'ADD_SUMMARY', payload: summary });
    setIsAddingSummary(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_SESSION', payload: sessionId });
      setSelectedSessionId(null);
      navigate(`/sessions?day=${activeDay}&view=${viewMode}`, { replace: true });
    }
  };
  
  const selectedSession = selectedSessionId
    ? sessions.find(session => session.id === selectedSessionId)
    : null;
  
  const sessionAttendees = selectedSession
    ? getMembersAttendingSession(selectedSession.id, attendance, team)
    : [];
  
  const sessionSummaries = selectedSession
    ? getSummariesForSession(selectedSession.id, summaries)
    : [];
  
  const currentMember = currentMemberId
    ? team.find(member => member.id === currentMemberId)
    : null;
  
  const currentMemberSummary = selectedSession && currentMemberId
    ? summaries.find(s => s.sessionId === selectedSession.id && s.authorId === currentMemberId)
    : null;

  const canDeleteSession = selectedSession?.isCustom && selectedSession?.createdBy === currentMemberId;
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row">
        <div className={`lg:w-1/2 xl:w-2/3 ${selectedSessionId ? 'lg:border-r' : ''}`}>
          <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
            <div className="px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
                <p className="text-gray-600">AI Engineer World's Fair 2025</p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Link
                  to="/add-session"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus size={16} className="mr-2" />
                  Add Session
                </Link>

                <div className="flex rounded-md shadow-sm" role="group">
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-l-lg border
                      ${viewMode === 'list'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <ListIcon size={16} />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('calendar')}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b -ml-px
                      ${viewMode === 'calendar'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <GridIcon size={16} />
                  </button>
                </div>

                <Link
                  to="/"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Calendar size={16} className="mr-2" />
                  Dashboard
                </Link>
                
                <div className="relative">
                  <button
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setCurrentMemberId(currentMemberId ? null : team[0]?.id || null)}
                  >
                    <User size={16} className="mr-2" />
                    {currentMember ? currentMember.name : 'View as'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="px-4 sm:px-6 lg:px-8 pb-4">
              <SearchFilter 
                sessions={sessions} 
                onFilterChange={setFilteredSessions} 
              />
            </div>
            
            {viewMode === 'list' && (
              <div className="border-t border-b border-gray-200">
                <div className="sm:hidden">
                  <select
                    id="days"
                    name="days"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={activeDay}
                    onChange={(e) => handleDayChange(parseInt(e.target.value))}
                  >
                    <option value={1}>Day 1 (June 3)</option>
                    <option value={2}>Day 2 (June 4)</option>
                    <option value={3}>Day 3 (June 4)</option>
                  </select>
                </div>
                <div className="hidden sm:block">
                  <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                    {[1, 2, 3].map((day) => (
                      <button
                        key={day}
                        onClick={() => handleDayChange(day)}
                        className={`
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                          ${
                            activeDay === day
                              ? 'border-indigo-500 text-indigo-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        Day {day}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}
          </div>
          
          <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {viewMode === 'list' ? (
              <DaySchedule
                day={activeDay}
                sessions={filteredSessions}
                currentMemberId={currentMemberId}
                onSessionClick={handleSessionClick}
                onToggleAttendance={handleToggleAttendance}
              />
            ) : (
              <CalendarView
                sessions={filteredSessions}
                onSessionClick={handleSessionClick}
              />
            )}
          </div>
        </div>
        
        {selectedSession && (
          <div className="lg:w-1/2 xl:w-1/3 border-t lg:border-t-0">
            <div className="h-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - 75px)' }}>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900 pr-4">{selectedSession.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {selectedSession.track}
                    </span>
                    {canDeleteSession && (
                      <button
                        onClick={() => handleDeleteSession(selectedSession.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                        title="Delete session"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="mt-1 text-sm text-gray-500">
                  Day {selectedSession.day} • {selectedSession.startTime}-{selectedSession.endTime} • {selectedSession.room}
                </p>
                
                <div className="mt-4">
                  <p className="text-gray-700">{selectedSession.description}</p>
                </div>
                
                <div className="mt-6 flex items-center">
                  <img 
                    src={selectedSession.speaker.image} 
                    alt={selectedSession.speaker.name}
                    className="h-12 w-12 rounded-full mr-4" 
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedSession.speaker.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedSession.speaker.title}, {selectedSession.speaker.company}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Team Attendance</h3>
                  
                  {team.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No team members added yet</p>
                      <Link 
                        to="/team" 
                        className="inline-flex items-center mt-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <UserPlus size={16} className="mr-1" />
                        Add Team Members
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <TeamSelector 
                          selectedIds={sessionAttendees.map(m => m.id)}
                          onSelect={(memberId) => handleToggleAttendance(selectedSession.id, memberId)}
                          onDeselect={(memberId) => handleToggleAttendance(selectedSession.id, memberId)}
                          showAddButton
                        />
                      </div>
                      
                      {sessionAttendees.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          No team members attending this session yet
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {sessionAttendees.length} team member{sessionAttendees.length !== 1 ? 's' : ''} attending
                        </p>
                      )}
                    </>
                  )}
                </div>
                
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Knowledge Sharing</h3>
                    
                    {currentMember && !isAddingSummary && !currentMemberSummary && (
                      <button
                        onClick={() => setIsAddingSummary(true)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Add Summary
                      </button>
                    )}
                  </div>
                  
                  {isAddingSummary && currentMember && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <SummaryForm
                        session={selectedSession}
                        author={currentMember}
                        onSave={handleSaveSummary}
                        onCancel={() => setIsAddingSummary(false)}
                      />
                    </div>
                  )}
                  
                  {sessionSummaries.length > 0 ? (
                    <div className="space-y-4">
                      {sessionSummaries.map(summary => {
                        const author = team.find(m => m.id === summary.authorId);
                        if (!author) return null;
                        
                        return (
                          <SummaryCard
                            key={summary.id}
                            summary={summary}
                            session={selectedSession}
                            author={author}
                            onEdit={currentMemberId === author.id ? () => setIsAddingSummary(true) : undefined}
                            onDelete={
                              currentMemberId === author.id 
                                ? () => dispatch({ type: 'REMOVE_SUMMARY', payload: summary.id }) 
                                : undefined
                            }
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No summaries shared for this session yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};