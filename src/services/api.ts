import axios from 'axios';
import { Screen, Playlist, Content } from '../contexts/AppContext';

// Use window.location.protocol to match the frontend protocol
const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Screens API
export const screensApi = {
  getAll: async (): Promise<Screen[]> => {
    const response = await api.get('/api/screens');
    return response.data;
  },
  
  getById: async (id: string): Promise<Screen> => {
    const response = await api.get(`/api/screens/${id}`);
    return response.data;
  },
  
  create: async (screen: Omit<Screen, 'id' | 'createdAt'>): Promise<Screen> => {
    const response = await api.post('/api/screens', screen);
    return response.data;
  },
  
  update: async (id: string, updates: Partial<Screen>): Promise<Screen> => {
    const response = await api.patch(`/api/screens/${id}`, updates);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/screens/${id}`);
  },
};

// Playlists API
export const playlistsApi = {
  getAll: async (): Promise<Playlist[]> => {
    const response = await api.get('/api/playlists');
    return response.data;
  },
  
  getById: async (id: string): Promise<Playlist> => {
    const response = await api.get(`/api/playlists/${id}`);
    return response.data;
  },
  
  create: async (playlist: Omit<Playlist, 'id' | 'createdAt'>): Promise<Playlist> => {
    const response = await api.post('/api/playlists', playlist);
    return response.data;
  },
  
  update: async (id: string, updates: Partial<Playlist>): Promise<Playlist> => {
    const response = await api.patch(`/api/playlists/${id}`, updates);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/playlists/${id}`);
  },
};

// Content API
export const contentApi = {
  getAll: async (): Promise<Content[]> => {
    const response = await api.get('/api/content');
    return response.data;
  },
  
  getById: async (id: string): Promise<Content> => {
    const response = await api.get(`/api/content/${id}`);
    return response.data;
  },
  
  create: async (content: Omit<Content, 'id' | 'createdAt'>, file?: File): Promise<Content> => {
    const formData = new FormData();
    Object.entries(content).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    if (file) {
      formData.append('file', file);
    }
    
    const response = await api.post('/api/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  update: async (id: string, updates: Partial<Content>, file?: File): Promise<Content> => {
    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (file) {
      formData.append('file', file);
    }
    
    const response = await api.patch(`/api/content/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/content/${id}`);
  },
};

// Display API
export const displayApi = {
  getDisplayData: async (screenId: string) => {
    const response = await api.get(`/api/display/${screenId}`);
    return response.data;
  },
};

export default api;