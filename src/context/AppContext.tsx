import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AppState, Attendance, TeamMember, Session, Note } from '../types';
import { fetchSessions } from '../utils/api';
import { saveState, loadState } from '../utils/supabase';

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
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  team: [],
  sessions: [],
  attendance: [],
  notes: [],
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  let newState: AppState;
  
  switch (action.type) {
    case 'SET_SESSIONS':
      newState = {
        ...state,
        sessions: [...action.payload, ...state.sessions.filter(s => s.isCustom)],
        attendance: state.attendance.filter(a => 
          action.payload.some(s => s.id === a.sessionId) ||
          state.sessions.some(s => s.isCustom && s.id === a.sessionId)
        ),
      };
      break;
      
    case 'SET_TEAM':
      newState = { ...state, team: action.payload };
      break;
      
    case 'ADD_TEAM_MEMBER':
      newState = { ...state, team: [...state.team, action.payload] };
      break;
      
    case 'REMOVE_TEAM_MEMBER':
      newState = {
        ...state,
        team: state.team.filter((member) => member.id !== action.payload),
        attendance: state.attendance.filter((a) => a.memberId !== action.payload),
        notes: state.notes.filter((n) => n.memberId !== action.payload),
      };
      break;
      
    case 'UPDATE_TEAM_MEMBER':
      newState = {
        ...state,
        team: state.team.map((member) =>
          member.id === action.payload.id ? action.payload : member
        ),
      };
      break;
      
    case 'SET_ATTENDANCE':
      newState = { ...state, attendance: action.payload };
      break;
      
    case 'TOGGLE_ATTENDANCE': {
      const { sessionId, memberId } = action.payload;
      const existingIndex = state.attendance.findIndex(
        (a) => a.sessionId === sessionId && a.memberId === memberId
      );

      if (existingIndex >= 0) {
        newState = {
          ...state,
          attendance: state.attendance.filter((_, i) => i !== existingIndex),
        };
      } else {
        newState = {
          ...state,
          attendance: [...state.attendance, action.payload],
        };
      }
      break;
    }
      
    case 'ADD_SESSION':
      newState = {
        ...state,
        sessions: [...state.sessions, action.payload],
      };
      break;
      
    case 'UPDATE_SESSION':
      newState = {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === action.payload.id ? action.payload : session
        ),
      };
      break;
      
    case 'DELETE_SESSION':
      newState = {
        ...state,
        sessions: state.sessions.filter((session) => session.id !== action.payload),
        attendance: state.attendance.filter((a) => a.sessionId !== action.payload),
        notes: state.notes.filter((n) => n.sessionId !== action.payload),
      };
      break;

    case 'ADD_NOTE':
      newState = {
        ...state,
        notes: [...state.notes, action.payload],
      };
      break;

    case 'UPDATE_NOTE':
      newState = {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
      break;

    case 'DELETE_NOTE':
      newState = {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
      break;
      
    case 'LOAD_STATE':
      newState = {
        team: action.payload.team || [],
        sessions: action.payload.sessions || [],
        attendance: action.payload.attendance || [],
        notes: action.payload.notes || [], // Ensure notes is always an array
      };
      break;
      
    default:
      return state;
  }
  
  // Save state to Supabase after each change
  saveState(newState);
  return newState;
};

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const initializeState = async () => {
      try {
        // Load state from Supabase
        const savedState = await loadState();
        if (savedState) {
          dispatch({ type: 'LOAD_STATE', payload: savedState });
        }
        
        // Fetch sessions
        const sessions = await fetchSessions();
        dispatch({ type: 'SET_SESSIONS', payload: sessions });
      } catch (error) {
        console.error('Failed to initialize state:', error);
      }
    };
    
    initializeState();
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