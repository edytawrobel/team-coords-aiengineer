import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, ArrowLeft } from 'lucide-react';
import { TeamSelector } from '../components/TeamSelector';
import { generateId } from '../utils/helpers';

export const AddSession = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState('');
  
  const [session, setSession] = useState({
    title: '',
    description: '',
    day: 1,
    startTime: '',
    endTime: '',
    room: '',
    speaker: {
      name: '',
      title: '',
      company: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember) {
      alert('Please select a team member');
      return;
    }

    const newSession = {
      id: generateId(),
      ...session,
      isCustom: true,
      createdBy: selectedMember,
      track: 'Custom Session',
      date: `June ${session.day + 2}, 2025`,
      speaker: {
        id: generateId(),
        ...session.speaker,
        bio: '',
        image: '',
      },
    };

    dispatch({ type: 'ADD_SESSION', payload: newSession });
    dispatch({
      type: 'TOGGLE_ATTENDANCE',
      payload: { sessionId: newSession.id, memberId: selectedMember },
    });

    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Manual Session</h1>
          <p className="text-gray-600">Add a custom session to your schedule</p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Member Adding This Session
            </label>
            <TeamSelector
              selectedIds={selectedMember ? [selectedMember] : []}
              onSelect={(id) => setSelectedMember(id)}
              onDeselect={() => setSelectedMember('')}
              showAddButton
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Session Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={session.title}
              onChange={(e) => setSession({ ...session, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={session.description}
              onChange={(e) => setSession({ ...session, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700">
                Day *
              </label>
              <select
                id="day"
                required
                value={session.day}
                onChange={(e) => setSession({ ...session, day: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value={1}>Day 1 (June 3)</option>
                <option value={2}>Day 2 (June 4)</option>
                <option value={3}>Day 3 (June 5)</option>
              </select>
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time *
              </label>
              <input
                type="time"
                id="startTime"
                required
                value={session.startTime}
                onChange={(e) => setSession({ ...session, startTime: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time *
              </label>
              <input
                type="time"
                id="endTime"
                required
                value={session.endTime}
                onChange={(e) => setSession({ ...session, endTime: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="room" className="block text-sm font-medium text-gray-700">
              Location/Room *
            </label>
            <input
              type="text"
              id="room"
              required
              value={session.room}
              onChange={(e) => setSession({ ...session, room: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Speaker Information</h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="speakerName" className="block text-sm font-medium text-gray-700">
                  Speaker Name *
                </label>
                <input
                  type="text"
                  id="speakerName"
                  required
                  value={session.speaker.name}
                  onChange={(e) => setSession({
                    ...session,
                    speaker: { ...session.speaker, name: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="speakerTitle" className="block text-sm font-medium text-gray-700">
                  Speaker Title
                </label>
                <input
                  type="text"
                  id="speakerTitle"
                  value={session.speaker.title}
                  onChange={(e) => setSession({
                    ...session,
                    speaker: { ...session.speaker, title: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="speakerCompany" className="block text-sm font-medium text-gray-700">
                  Company/Organization
                </label>
                <input
                  type="text"
                  id="speakerCompany"
                  value={session.speaker.company}
                  onChange={(e) => setSession({
                    ...session,
                    speaker: { ...session.speaker, company: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Session
          </button>
        </div>
      </form>
    </div>
  );
};