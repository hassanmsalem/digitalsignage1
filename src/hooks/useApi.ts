import { useApp } from '../contexts/AppContext';
import { screensApi, playlistsApi, contentApi } from '../services/api';

export function useApi() {
  const { dispatch } = useApp();

  const handleError = (error: any, message: string) => {
    console.error(message, error);
    dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || message });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  // Screens
  const fetchScreens = async () => {
    try {
      setLoading(true);
      const screens = await screensApi.getAll();
      dispatch({ type: 'SET_SCREENS', payload: Array.isArray(screens) ? screens : [] });
    } catch (error) {
      handleError(error, 'Failed to fetch screens');
    } finally {
      setLoading(false);
    }
  };

  const createScreen = async (screen: any) => {
    try {
      setLoading(true);
      const newScreen = await screensApi.create(screen);
      dispatch({ type: 'ADD_SCREEN', payload: newScreen });
      return newScreen;
    } catch (error) {
      handleError(error, 'Failed to create screen');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateScreen = async (id: string, updates: any) => {
    try {
      setLoading(true);
      const updatedScreen = await screensApi.update(id, updates);
      dispatch({ type: 'UPDATE_SCREEN', payload: updatedScreen });
      return updatedScreen;
    } catch (error) {
      handleError(error, 'Failed to update screen');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteScreen = async (id: string) => {
    try {
      setLoading(true);
      await screensApi.delete(id);
      dispatch({ type: 'DELETE_SCREEN', payload: id });
    } catch (error) {
      handleError(error, 'Failed to delete screen');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Playlists
  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const playlists = await playlistsApi.getAll();
      dispatch({ type: 'SET_PLAYLISTS', payload: Array.isArray(playlists) ? playlists : [] });
    } catch (error) {
      handleError(error, 'Failed to fetch playlists');
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (playlist: any) => {
    try {
      setLoading(true);
      const newPlaylist = await playlistsApi.create(playlist);
      dispatch({ type: 'ADD_PLAYLIST', payload: newPlaylist });
      return newPlaylist;
    } catch (error) {
      handleError(error, 'Failed to create playlist');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePlaylist = async (id: string, updates: any) => {
    try {
      setLoading(true);
      const updatedPlaylist = await playlistsApi.update(id, updates);
      dispatch({ type: 'UPDATE_PLAYLIST', payload: updatedPlaylist });
      return updatedPlaylist;
    } catch (error) {
      handleError(error, 'Failed to update playlist');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      setLoading(true);
      await playlistsApi.delete(id);
      dispatch({ type: 'DELETE_PLAYLIST', payload: id });
    } catch (error) {
      handleError(error, 'Failed to delete playlist');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Content
  const fetchContent = async () => {
    try {
      setLoading(true);
      const content = await contentApi.getAll();
      dispatch({ type: 'SET_CONTENT', payload: Array.isArray(content) ? content : [] });
    } catch (error) {
      handleError(error, 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (content: any, file?: File) => {
    try {
      setLoading(true);
      const newContent = await contentApi.create(content, file);
      dispatch({ type: 'ADD_CONTENT', payload: newContent });
      return newContent;
    } catch (error) {
      handleError(error, 'Failed to create content');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (id: string, updates: any, file?: File) => {
    try {
      setLoading(true);
      const updatedContent = await contentApi.update(id, updates, file);
      dispatch({ type: 'UPDATE_CONTENT', payload: updatedContent });
      return updatedContent;
    } catch (error) {
      handleError(error, 'Failed to update content');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id: string) => {
    try {
      setLoading(true);
      await contentApi.delete(id);
      dispatch({ type: 'DELETE_CONTENT', payload: id });
    } catch (error) {
      handleError(error, 'Failed to delete content');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Screens
    fetchScreens,
    createScreen,
    updateScreen,
    deleteScreen,
    // Playlists
    fetchPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    // Content
    fetchContent,
    createContent,
    updateContent,
    deleteContent,
  };
}