import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Content {
  id: string;
  name: string;
  type: 'image' | 'video' | 'text' | 'url';
  url: string;
  duration: number;
  fileName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  contentIds: string[];
  duration: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Screen {
  id: string;
  name: string;
  location: string;
  playlistId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface AppState {
  screens: Screen[];
  playlists: Playlist[];
  content: Content[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SCREENS'; payload: Screen[] }
  | { type: 'SET_PLAYLISTS'; payload: Playlist[] }
  | { type: 'SET_CONTENT'; payload: Content[] }
  | { type: 'ADD_SCREEN'; payload: Screen }
  | { type: 'UPDATE_SCREEN'; payload: Screen }
  | { type: 'DELETE_SCREEN'; payload: string }
  | { type: 'ADD_PLAYLIST'; payload: Playlist }
  | { type: 'UPDATE_PLAYLIST'; payload: Playlist }
  | { type: 'DELETE_PLAYLIST'; payload: string }
  | { type: 'ADD_CONTENT'; payload: Content }
  | { type: 'UPDATE_CONTENT'; payload: Content }
  | { type: 'DELETE_CONTENT'; payload: string };

const initialState: AppState = {
  screens: [],
  playlists: [],
  content: [],
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SCREENS':
      return { ...state, screens: action.payload };
    case 'SET_PLAYLISTS':
      return { ...state, playlists: action.payload };
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'ADD_SCREEN':
      return { ...state, screens: [...state.screens, action.payload] };
    case 'UPDATE_SCREEN':
      return {
        ...state,
        screens: state.screens.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SCREEN':
      return {
        ...state,
        screens: state.screens.filter(s => s.id !== action.payload)
      };
    case 'ADD_PLAYLIST':
      return { ...state, playlists: [...state.playlists, action.payload] };
    case 'UPDATE_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.filter(p => p.id !== action.payload)
      };
    case 'ADD_CONTENT':
      return { ...state, content: [...state.content, action.payload] };
    case 'UPDATE_CONTENT':
      return {
        ...state,
        content: state.content.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_CONTENT':
      return {
        ...state,
        content: state.content.filter(c => c.id !== action.payload)
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}