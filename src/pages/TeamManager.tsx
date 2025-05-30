import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { TeamMember as TeamMemberType } from '../types';
import { TeamMember } from '../components/TeamMember';
import { generateId } from '../utils/helpers';
import { teamColors, getNextAvailableColor } from '../utils/teamColors';
import { UserPlus, Users, X, Edit, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeamManager: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newMember, setNewMember] = useState<Partial<TeamMemberType>>({
    name: '',
    role: '',
    avatar: '',
  });
  
  const handleAddMember = () => {
    if (!newMember.name) return;
    
    // Get the next available color
    const usedColors = state.team.map(member => member.color);
    const colorObj = getNextAvailableColor(usedColors);
    
    const member: TeamMemberType = {
      id: generateId(),
      name: newMember.name,
      role: newMember.role || 'Team Member',
      avatar: newMember.avatar || '',
      color: colorObj.name,
    };
    
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: member });
    setNewMember({ name: '', role: '', avatar: '' });
    setIsAdding(false);
  };
  
  const handleUpdateMember = (id: string) => {
    const member = state.team.find(m => m.id === id);
    if (!member || !newMember.name) return;
    
    const updatedMember: TeamMemberType = {
      ...member,
      name: newMember.name,
      role: newMember.role || member.role,
      avatar: newMember.avatar || member.avatar,
    };
    
    dispatch({ type: 'UPDATE_TEAM_MEMBER', payload: updatedMember });
    setNewMember({ name: '', role: '', avatar: '' });
    setEditingId(null);
  };
  
  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to remove this team member? This action will be saved to the database.')) {
      dispatch({ type: 'REMOVE_TEAM_MEMBER', payload: id });
    }
  };
  
  const handleEditMember = (member: TeamMemberType) => {
    setNewMember({
      name: member.name,
      role: member.role,
      avatar: member.avatar,
    });
    setEditingId(member.id);
    setIsAdding(false);
  };
  
  const handleCancel = () => {
    setNewMember({ name: '', role: '', avatar: '' });
    setIsAdding(false);
    setEditingId(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage your 10-person conference team</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3"
          >
            Back to Dashboard
          </Link>
          
          {!isAdding && !editingId && state.team.length < 10 && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <UserPlus size={16} className="mr-2" />
              Add Team Member
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {(isAdding || editingId) && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="AI Engineer"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                  Avatar URL (optional)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="avatar"
                    value={newMember.avatar}
                    onChange={(e) => setNewMember({ ...newMember, avatar: e.target.value })}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Leave blank to use default avatar
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
              
              <button
                type="button"
                onClick={editingId ? () => handleUpdateMember(editingId) : handleAddMember}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                disabled={!newMember.name}
              >
                <Save size={16} className="mr-2" />
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        )}
        
        <div className="p-6">
          {state.team.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No team members</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new team member. Changes will be saved automatically.
              </p>
              {!isAdding && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <UserPlus size={16} className="mr-2" />
                    Add Team Member
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Team Members ({state.team.length}/10)
              </h3>
              <div className="space-y-4">
                {state.team.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      editingId === member.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <TeamMember member={member} showRole size="lg" />
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                        title="Edit member"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                        title="Remove member"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};