import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Users, Clock, BarChart, Download } from 'lucide-react';
import { Session } from '../types';
import { DailyBriefing } from '../components/DailyBriefing';
import { OverlapAnalysis } from '../components/OverlapAnalysis';
import { CalendarView } from '../components/CalendarView';
import { Link, useNavigate } from 'react-router-dom';
import { exportToExcel } from '../utils/export';

interface DashboardTab {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calendar');
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const tabs: DashboardTab[] = [
    { id: 'calendar', name: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'day1', name: 'Day 1', icon: <Clock size={20} /> },
    { id: 'day2', name: 'Day 2', icon: <Clock size={20} /> },
    { id: 'day3', name: 'Day 3', icon: <Clock size={20} /> },
    { id: 'analysis', name: 'Analysis', icon: <BarChart size={20} /> },
  ];
  
  const handleViewSession = (session: Session) => {
    navigate(`/sessions?day=${session.day}&id=${session.id}`);
  };
  
  const handleViewSessionById = (sessionId: string) => {
    const session = state.sessions.find(s => s.id === sessionId);
    if (session) {
      navigate(`/sessions?day=${session.day}&id=${session.id}`);
    }
  };

  const handleExport = () => {
    exportToExcel(state.sessions, state.team, state.attendance);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
            <p className="text-gray-600">{currentDate}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download size={16} className="mr-2" />
              Export to Excel
            </button>
            <Link
              to="/schedule"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Calendar size={16} className="mr-2" />
              Schedule
            </Link>
            <Link
              to="/team"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Users size={16} className="mr-2" />
              Team Members
            </Link>
          </div>
        </div>
      </div>
      
      {state.team.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Users className="mx-auto text-gray-400 mb-2" size={32} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Welcome to your Team Coordination App!
          </h2>
          <p className="text-gray-600 mb-4">
            Start by adding your team members to coordinate conference attendance.
          </p>
          <Link
            to="/team"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Users size={16} className="mr-2" />
            Add Team Members
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="sm:hidden">
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                        ${
                          activeTab === tab.id
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          
          <div>
            {activeTab === 'calendar' && (
              <CalendarView sessions={state.sessions} onSessionClick={handleViewSession} />
            )}
            {activeTab === 'day1' && (
              <DailyBriefing day={1} onViewSession={handleViewSession} />
            )}
            {activeTab === 'day2' && (
              <DailyBriefing day={2} onViewSession={handleViewSession} />
            )}
            {activeTab === 'day3' && (
              <DailyBriefing day={3} onViewSession={handleViewSession} />
            )}
            {activeTab === 'analysis' && (
              <OverlapAnalysis onViewSession={handleViewSessionById} />
            )}
          </div>
        </>
      )}
    </div>
  );
};