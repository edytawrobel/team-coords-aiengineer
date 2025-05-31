import React from 'react';
import { AppProvider } from './context/AppContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { TeamManager } from './pages/TeamManager';
import { Schedule } from './pages/Schedule';
import { AddSession } from './pages/AddSession';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/team" element={<TeamManager />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/add-session" element={<AddSession />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;