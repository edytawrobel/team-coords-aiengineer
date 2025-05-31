import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Plus, Users, X } from 'lucide-react';
import { TeamSelector } from '../components/TeamSelector';
import { getMembersAttendingSession } from '../utils/helpers';

export const Schedule: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('id');
    if (sessionId) {
      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
        setSelectedDay(session.day);
        setSelectedSessionId(sessionId);
      }
    }
  }, [location.search, state.sessions]);

  const daySessions = state.sessions.filter(session => session.day === selectedDay);
  const selectedSession = selectedSessionId ? state.sessions.find(s => s.id === selectedSessionId) : null;

  const handleToggleAttendance = (sessionId: string, memberId: string) => {
    dispatch({
      type: 'TOGGLE_ATTENDANCE',
      payload: {
        sessionId,
        memberId,
      },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleCloseSession = () => {
    setSelectedSessionId(null);
    navigate('/schedule');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`lg:w-1/2 xl:w-2/3 ${selectedSession ? 'lg:border-r' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="mr-2 text-indigo-500" size={24} />
                Schedule Sessions
              </h1>
              <p className="text-gray-600">Add sessions to your team members' schedules</p>
            </div>
            
            <div className="flex space-x-3">
              <Link
                to="/add-session"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus size={16} className="mr-2" />
                Add Session
              </Link>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={1}>Day 1 (June 3)</option>
                  <option value={2}>Day 2 (June 4)</option>
                  <option value={3}>Day 3 (June 5)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Team Member</label>
                <TeamSelector
                  selectedIds={selectedMember ? [selectedMember] : []}
                  onSelect={(id) => setSelectedMember(id)}
                  onDeselect={() => setSelectedMember('')}
                  showAddButton
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {daySessions.map(session => {
              const attendees = getMembersAttendingSession(session.id, state.attendance, state.team);
              const isAttending = selectedMember && attendees.some(m => m.id === selectedMember);

              return (
                <div
                  key={session.id}
                  className={`
                    bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer
                    ${selectedSessionId === session.id ? 'ring-2 ring-indigo-500' : ''}
                  `}
                  onClick={() => {
                    setSelectedSessionId(session.id);
                    navigate(`/schedule?id=${session.id}`);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-500">
                        {session.startTime} - {session.endTime} • {session.room}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {attendees.length} team member{attendees.length !== 1 ? 's' : ''} attending
                      </p>
                    </div>

                    {selectedMember && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleAttendance(session.id, selectedMember);
                        }}
                        className={`
                          inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md
                          ${isAttending
                            ? 'text-white bg-red-600 hover:bg-red-700'
                            : 'text-white bg-indigo-600 hover:bg-indigo-700'
                          }
                        `}
                      >
                        {isAttending ? 'Remove from Schedule' : 'Add to Schedule'}
                      </button>
                    )}
                  </div>

                  {attendees.length > 0 && (
                    <div className="mt-3 flex -space-x-2">
                      {attendees.map(member => (
                        <div
                          key={member.id}
                          className={`inline-block h-8 w-8 rounded-full ring-2 ring-white bg-${member.color}-500 flex items-center justify-center text-sm text-white font-bold`}
                          title={member.name}
                        >
                          {getInitials(member.name)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedSession && (
          <div className="lg:w-1/2 xl:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedSession.title}</h2>
                <button
                  onClick={handleCloseSession}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {selectedSession.track}
                  </span>
                  <p className="mt-2 text-sm text-gray-500">
                    Day {selectedSession.day} • {selectedSession.startTime}-{selectedSession.endTime} • {selectedSession.room}
                  </p>
                </div>

                <div className="prose prose-sm">
                  <p className="text-gray-700">{selectedSession.description}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center">
                    <img
                      src={selectedSession.speaker.image}
                      alt={selectedSession.speaker.name}
                      className="h-12 w-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedSession.speaker.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedSession.speaker.title}
                        {selectedSession.speaker.company && ` • ${selectedSession.speaker.company}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Users size={20} className="mr-2" />
                    Team Attendance
                  </h3>
                  <TeamSelector
                    selectedIds={getMembersAttendingSession(selectedSession.id, state.attendance, state.team).map(m => m.id)}
                    onSelect={(id) => handleToggleAttendance(selectedSession.id, id)}
                    onDeselect={(id) => handleToggleAttendance(selectedSession.id, id)}
                    showAddButton
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};