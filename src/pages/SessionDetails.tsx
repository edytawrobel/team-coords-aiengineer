import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Users, X, ArrowLeft } from 'lucide-react';
import { TeamSelector } from '../components/TeamSelector';
import { getMembersAttendingSession } from '../utils/helpers';

export const SessionDetails: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const sessionId = new URLSearchParams(location.search).get('id');
  const session = sessionId ? state.sessions.find(s => s.id === sessionId) : null;

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Session not found</h2>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const attendees = getMembersAttendingSession(session.id, state.attendance, state.team);

  const handleToggleAttendance = (memberId: string) => {
    dispatch({
      type: 'TOGGLE_ATTENDANCE',
      payload: {
        sessionId: session.id,
        memberId,
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
            <p className="text-gray-600">
              Day {session.day} • {session.startTime}-{session.endTime} • {session.room}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {session.track}
            </span>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700">{session.description}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center">
              <img
                src={session.speaker.image}
                alt={session.speaker.name}
                className="h-12 w-12 rounded-full mr-4"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {session.speaker.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {session.speaker.title}
                  {session.speaker.company && ` • ${session.speaker.company}`}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Users size={20} className="mr-2" />
              Team Attendance
            </h3>
            <TeamSelector
              selectedIds={attendees.map(m => m.id)}
              onSelect={handleToggleAttendance}
              onDeselect={handleToggleAttendance}
              showAddButton
            />
          </div>
        </div>
      </div>
    </div>
  );
};