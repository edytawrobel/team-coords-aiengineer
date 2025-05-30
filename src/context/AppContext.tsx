import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AppState, Attendance, TeamMember, Session, Summary } from '../types';
import { fetchSessions } from '../utils/api';

type AppAction =
  | { type: 'SET_SESSIONS'; payload: AppState['sessions'] }
  | { type: 'SET_TEAM'; payload: AppState['team'] }
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'REMOVE_TEAM_MEMBER'; payload: string }
  | { type: 'UPDATE_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'SET_ATTENDANCE'; payload: AppState['attendance'] }
  | { type: 'TOGGLE_ATTENDANCE'; payload: Attendance }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'ADD_SUMMARY'; payload: Summary }
  | { type: 'REMOVE_SUMMARY'; payload: string }
  | { type: 'SET_SUMMARIES'; payload: Summary[] };

const initialState: AppState = {
  team: [],
  sessions: [],
  attendance: [],
  summaries: [],
};

const loadInitialState = (): AppState => {
  try {
    const savedState = localStorage.getItem('conferenceAppState');
    if (!savedState) return initialState;

    const parsedState = JSON.parse(savedState);
    return {
      ...initialState,
      team: parsedState.team || [],
      attendance: parsedState.attendance || [],
      sessions: parsedState.sessions || [],
      summaries: parsedState.summaries || [],
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return initialState;
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_SESSIONS':
      return {
        ...state,
        sessions: [...action.payload, ...state.sessions.filter(s => s.isCustom)],
        attendance: state.attendance.filter(a => 
          action.payload.some(s => s.id === a.sessionId) ||
          state.sessions.some(s => s.isCustom && s.id === a.sessionId)
        ),
      };
    case 'SET_TEAM':
      return { ...state, team: action.payload };
    case 'ADD_TEAM_MEMBER':
      return { ...state, team: [...state.team, action.payload] };
    case 'REMOVE_TEAM_MEMBER':
      return {
        ...state,
        team: state.team.filter((member) => member.id !== action.payload),
        attendance: state.attendance.filter((a) => a.memberId !== action.payload),
      };
    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        team: state.team.map((member) =>
          member.id === action.payload.id ? action.payload : member
        ),
      };
    case 'SET_ATTENDANCE':
      return { ...state, attendance: action.payload };
    case 'TOGGLE_ATTENDANCE': {
      const { sessionId, memberId } = action.payload;
      const existingIndex = state.attendance.findIndex(
        (a) => a.sessionId === sessionId && a.memberId === memberId
      );

      if (existingIndex >= 0) {
        return {
          ...state,
          attendance: state.attendance.filter((_, i) => i !== existingIndex),
        };
      } else {
        return {
          ...state,
          attendance: [...state.attendance, action.payload],
        };
      }
    }
    case 'ADD_SESSION':
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
      };
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === action.payload.id ? action.payload : session
        ),
      };
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter((session) => session.id !== action.payload),
        attendance: state.attendance.filter((a) => a.sessionId !== action.payload),
        summaries: state.summaries.filter((s) => s.sessionId !== action.payload),
      };
    case 'ADD_SUMMARY':
      return {
        ...state,
        summaries: [...state.summaries, action.payload],
      };
    case 'REMOVE_SUMMARY':
      return {
        ...state,
        summaries: state.summaries.filter((summary) => summary.id !== action.payload),
      };
    case 'SET_SUMMARIES':
      return {
        ...state,
        summaries: action.payload,
      };
    default:
      return state;
  }
};

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, loadInitialState());

  useEffect(() => {
    localStorage.setItem('conferenceAppState', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessions = await fetchSessions();
        dispatch({ type: 'SET_SESSIONS', payload: sessions });
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      }
    };
    loadSessions();
  }, []);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};