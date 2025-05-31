import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Plus, Download } from 'lucide-react';
import { TeamSelector } from '../components/TeamSelector';
import { getMembersAttendingSession } from '../utils/helpers';
import { exportToExcel, exportToPDF } from '../utils/export';

export const Schedule: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMember, setSelectedMember] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const daySessions = state.sessions.filter(session => session.day === selectedDay);

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

  const handleExport = (format: 'excel' | 'pdf') => {
    if (format === 'excel') {
      exportToExcel(state.sessions, state.team, state.attendance);
    } else {
      exportToPDF(state.sessions, state.team, state.attendance);
    }
    setShowExportMenu(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="mr-2 text-indigo-500" size={24} />
            Schedule Sessions
          </h1>
          <p className="text-gray-600">Add sessions to your team members' schedules</p>
        </div>
        
        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu">
                  <button
                    onClick={() => handleExport('excel')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Export to Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Export to PDF
                  </button>
                </div>
              </div>
            )}
          </div>

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
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
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
                    onClick={() => handleToggleAttendance(session.id, selectedMember)}
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
  );
};