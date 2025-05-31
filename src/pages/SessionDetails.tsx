import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Users, X, ArrowLeft, Edit, Save, BookOpen } from 'lucide-react';
import { TeamSelector } from '../components/TeamSelector';
import { getMembersAttendingSession, generateId } from '../utils/helpers';

export const SessionDetails: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const sessionId = new URLSearchParams(location.search).get('id');
  const session = sessionId ? state.sessions.find(s => s.id === sessionId) : null;
  const [isEditing, setIsEditing] = useState(false);
  const [editedSession, setEditedSession] = useState(session);
  const [noteContent, setNoteContent] = useState('');
  const [showNoteEditor, setShowNoteEditor] = useState(false);

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
  const sessionNotes = state.notes.filter(note => note.sessionId === session.id);

  const handleToggleAttendance = (memberId: string) => {
    dispatch({
      type: 'TOGGLE_ATTENDANCE',
      payload: {
        sessionId: session.id,
        memberId,
      },
    });
  };

  const handleSave = () => {
    if (!editedSession) return;
    dispatch({ type: 'UPDATE_SESSION', payload: editedSession });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSession(session);
    setIsEditing(false);
  };

  const handleAddNote = (memberId: string) => {
    if (!noteContent.trim()) return;

    const note = {
      id: generateId(),
      sessionId: session.id,
      memberId,
      content: noteContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_NOTE', payload: note });
    setNoteContent('');
    setShowNoteEditor(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex space-x-3">
          <Link
            to="/notes"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <BookOpen size={16} className="mr-2" />
            Notes Exchange
          </Link>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Edit size={16} className="mr-2" />
              Edit Session
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Title
              </label>
              <input
                type="text"
                value={editedSession?.title}
                onChange={(e) => setEditedSession({ ...editedSession!, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day
                </label>
                <select
                  value={editedSession?.day}
                  onChange={(e) => setEditedSession({ ...editedSession!, day: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={1}>Day 1 (June 3)</option>
                  <option value={2}>Day 2 (June 4)</option>
                  <option value={3}>Day 3 (June 5)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={editedSession?.startTime}
                  onChange={(e) => setEditedSession({ ...editedSession!, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={editedSession?.endTime}
                  onChange={(e) => setEditedSession({ ...editedSession!, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room
              </label>
              <input
                type="text"
                value={editedSession?.room}
                onChange={(e) => setEditedSession({ ...editedSession!, room: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editedSession?.description}
                onChange={(e) => setEditedSession({ ...editedSession!, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Speaker Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editedSession?.speaker.name}
                    onChange={(e) => setEditedSession({
                      ...editedSession!,
                      speaker: { ...editedSession!.speaker, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editedSession?.speaker.title}
                    onChange={(e) => setEditedSession({
                      ...editedSession!,
                      speaker: { ...editedSession!.speaker, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={editedSession?.speaker.company}
                    onChange={(e) => setEditedSession({
                      ...editedSession!,
                      speaker: { ...editedSession!.speaker, company: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
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

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Session Notes</h3>
                {!showNoteEditor && (
                  <button
                    onClick={() => setShowNoteEditor(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Edit size={16} className="mr-2" />
                    Add Note
                  </button>
                )}
              </div>

              {showNoteEditor && (
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write your notes about this session..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="mt-3 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowNoteEditor(false)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <TeamSelector
                      selectedIds={[]}
                      onSelect={(memberId) => handleAddNote(memberId)}
                      showAddButton
                    />
                  </div>
                </div>
              )}

              {sessionNotes.length > 0 ? (
                <div className="space-y-4">
                  {sessionNotes.map(note => {
                    const author = state.team.find(m => m.id === note.memberId);
                    if (!author) return null;

                    return (
                      <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap mb-3">{note.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full bg-${author.color}-500 mr-2`} />
                            <span>{author.name}</span>
                          </div>
                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No notes have been added for this session yet
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};