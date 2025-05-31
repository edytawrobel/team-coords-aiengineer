import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Save, Trash2, Search } from 'lucide-react';
import { TeamMember } from '../components/TeamMember';
import { generateId } from '../utils/helpers';

export const NotesExchange: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const filteredNotes = state.notes
    .filter(note => {
      if (!searchTerm) return true;
      const session = state.sessions.find(s => s.id === note.sessionId);
      const member = state.team.find(m => m.id === note.memberId);
      const term = searchTerm.toLowerCase();
      
      // Only search by session title and team member name
      return (
        session?.title.toLowerCase().includes(term) ||
        member?.name.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleEditNote = (noteId: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setEditedContent(note.content);
    }
  };

  const handleSaveNote = (noteId: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (note) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: {
          ...note,
          content: editedContent,
          updatedAt: new Date().toISOString(),
        },
      });
      setEditingNoteId(null);
      setEditedContent('');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch({ type: 'DELETE_NOTE', payload: noteId });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes Exchange</h1>
          <p className="text-gray-600">Share and discover team insights from sessions</p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by session title or team member name..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredNotes.map(note => {
          const session = state.sessions.find(s => s.id === note.sessionId);
          const member = state.team.find(m => m.id === note.memberId);
          if (!session || !member) return null;

          return (
            <div key={note.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                  <p className="text-sm text-gray-500">
                    Day {session.day} • {session.startTime}-{session.endTime} • {session.room}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditNote(note.id)}
                    className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {editingNoteId === note.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveNote(note.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Save size={16} className="mr-2" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
                <TeamMember member={member} showRole size="sm" />
                <span className="text-sm text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}

        {filteredNotes.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-500">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Team members can add notes while viewing sessions'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};