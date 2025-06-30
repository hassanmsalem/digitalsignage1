import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useApi } from '../hooks/useApi';
import { Monitor, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Screens() {
  const { state, dispatch } = useApp();
  const { fetchScreens, createScreen, updateScreen, deleteScreen, fetchPlaylists } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [editingScreen, setEditingScreen] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    playlistId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchScreens();
    fetchPlaylists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingScreen) {
        await updateScreen(editingScreen.id, formData);
      } else {
        await createScreen(formData);
      }
      setShowModal(false);
      setEditingScreen(null);
      setFormData({ name: '', location: '', playlistId: '', isActive: true });
    } catch (error) {
      // Error handled by useApi hook
    }
  };

  const handleEdit = (screen: any) => {
    setEditingScreen(screen);
    setFormData({
      name: screen.name,
      location: screen.location,
      playlistId: screen.playlistId || '',
      isActive: screen.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this screen?')) {
      await deleteScreen(id);
    }
  };

  const getDisplayUrl = (screenId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/display/${screenId}`;
  };

  if (state.loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {state.error && (
        <ErrorMessage 
          message={state.error} 
          onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Screens</h1>
          <p className="text-gray-600">Manage your digital displays</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Screen</span>
        </button>
      </div>

      {/* Screens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.screens.map(screen => {
          const playlist = state.playlists.find(p => p.id === screen.playlistId);
          return (
            <div key={screen.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{screen.name}</h3>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  screen.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {screen.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {screen.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Playlist:</span> {playlist?.name || 'None assigned'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <a
                  href={getDisplayUrl(screen.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Display</span>
                </a>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(screen)}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(screen.id)}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {state.screens.length === 0 && (
        <div className="text-center py-12">
          <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No screens configured yet</p>
          <p className="text-gray-400">Create your first screen to get started</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingScreen ? 'Edit Screen' : 'Add New Screen'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Screen Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Playlist
                </label>
                <select
                  value={formData.playlistId}
                  onChange={(e) => setFormData({ ...formData, playlistId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No playlist assigned</option>
                  {state.playlists.map(playlist => (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingScreen(null);
                    setFormData({ name: '', location: '', playlistId: '', isActive: true });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingScreen ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}