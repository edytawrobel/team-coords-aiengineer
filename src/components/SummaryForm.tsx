import React, { useState } from 'react';
import { Session, Summary, TeamMember } from '../types';
import { generateId } from '../utils/helpers';
import { Star, Plus, Minus, Save } from 'lucide-react';

interface SummaryFormProps {
  session: Session;
  author: TeamMember;
  existingSummary?: Summary;
  onSave: (summary: Summary) => void;
  onCancel: () => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({
  session,
  author,
  existingSummary,
  onSave,
  onCancel,
}) => {
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(
    existingSummary?.keyTakeaways || ['', '', '']
  );
  const [actionableInsights, setActionableInsights] = useState(
    existingSummary?.actionableInsights || ''
  );
  const [resources, setResources] = useState<string[]>(
    existingSummary?.resources || ['']
  );
  const [speakerContact, setSpeakerContact] = useState(
    existingSummary?.speakerContact || ''
  );
  const [rating, setRating] = useState(existingSummary?.rating || 3);

  const addKeyTakeaway = () => {
    if (keyTakeaways.length < 5) {
      setKeyTakeaways([...keyTakeaways, '']);
    }
  };

  const removeKeyTakeaway = (index: number) => {
    if (keyTakeaways.length > 1) {
      setKeyTakeaways(keyTakeaways.filter((_, i) => i !== index));
    }
  };

  const updateKeyTakeaway = (index: number, value: string) => {
    const updated = [...keyTakeaways];
    updated[index] = value;
    setKeyTakeaways(updated);
  };

  const addResource = () => {
    setResources([...resources, '']);
  };

  const removeResource = (index: number) => {
    if (resources.length > 1) {
      setResources(resources.filter((_, i) => i !== index));
    }
  };

  const updateResource = (index: number, value: string) => {
    const updated = [...resources];
    updated[index] = value;
    setResources(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const summary: Summary = {
      id: existingSummary?.id || generateId(),
      sessionId: session.id,
      authorId: author.id,
      createdAt: existingSummary?.createdAt || new Date().toISOString(),
      keyTakeaways: keyTakeaways.filter(k => k.trim() !== ''),
      actionableInsights,
      resources: resources.filter(r => r.trim() !== ''),
      speakerContact,
      rating,
    };
    
    onSave(summary);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-indigo-50 p-4 rounded-md">
        <h3 className="font-medium text-indigo-800">{session.title}</h3>
        <p className="text-sm text-indigo-600">
          {session.speaker.name} • {session.date}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Key Takeaways (3-5 points)
        </label>
        {keyTakeaways.map((takeaway, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={takeaway}
              onChange={(e) => updateKeyTakeaway(index, e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`Takeaway ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeKeyTakeaway(index)}
              className="ml-2 p-2 text-gray-400 hover:text-red-500"
              disabled={keyTakeaways.length <= 1}
            >
              <Minus size={20} />
            </button>
          </div>
        ))}
        {keyTakeaways.length < 5 && (
          <button
            type="button"
            onClick={addKeyTakeaway}
            className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
          >
            <Plus size={16} className="mr-1" /> Add takeaway
          </button>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Actionable Insights
        </label>
        <textarea
          value={actionableInsights}
          onChange={(e) => setActionableInsights(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="What can your team implement based on this session?"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Relevant Tools & Resources
        </label>
        {resources.map((resource, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={resource}
              onChange={(e) => updateResource(index, e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tool, link, or resource mentioned"
            />
            <button
              type="button"
              onClick={() => removeResource(index)}
              className="ml-2 p-2 text-gray-400 hover:text-red-500"
              disabled={resources.length <= 1}
            >
              <Minus size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addResource}
          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
        >
          <Plus size={16} className="mr-1" /> Add resource
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Speaker Contact Info
        </label>
        <input
          type="text"
          value={speakerContact}
          onChange={(e) => setSpeakerContact(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Email, Twitter, LinkedIn, etc."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Session Rating
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`p-1 ${
                rating >= star 
                  ? 'text-amber-400' 
                  : 'text-gray-300 hover:text-gray-400'
              }`}
            >
              <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
        >
          <Save size={16} className="mr-2" />
          Save Summary
        </button>
      </div>
    </form>
  );
};