import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useApi } from '../hooks/useApi';
import { PlaySquare, Plus, Edit2, Trash2, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Playlists() {
  const { state, dispatch } = useApp();
  const { fetchPlaylists, createPlaylist, updatePlaylist, deletePlaylist, fetchContent } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contentIds: [] as string[],
    duration: 30,
  });

  useEffect(() => {
    fetchPlaylists();
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlaylist) {
        await updatePlaylist(editingPlaylist.id, formData);
      } else {
        await createPlaylist(formData);
      }
      setShowModal(false);
      setEditingPlaylist(null);
      setFormData({ name: '', description: '', contentIds: [], duration: 30 });
    } catch (error) {
      // Error handled by useApi hook
    }
  };

  const handleEdit = (playlist: any) => {
    setEditingPlaylist(playlist);
    setFormData({
      name: playlist.name,
      description: playlist.description,
      contentIds: playlist.contentIds,
      duration: playlist.duration,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      await deletePlaylist(id);
    }
  };

  const handleContentSelection = (contentId: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, contentIds: [...formData.contentIds, contentId] });
    } else {
      setFormData({ 
        ...formData, 
        contentIds: formData.contentIds.filter(id => id !== contentId) 
      });
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Playlists</h1>
          <p className="text-gray-600">Organize your content into playlists</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Playlist</span>
        </button>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.playlists.map(playlist => (
          <div key={playlist.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <PlaySquare className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">{playlist.name}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(playlist)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(playlist.id)}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {playlist.description && (
              <p className="text-gray-600 mb-3">{playlist.description}</p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{playlist.duration}s per item</span>
              </div>
              <span>{playlist.contentIds.length} items</span>
            </div>
          </div>
        ))}
      </div>

      {state.playlists.length === 0 && (
        <div className="text-center py-12">
          <PlaySquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No playlists created yet</p>
          <p className="text-gray-400">Create your first playlist to organize content</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingPlaylist ? 'Edit Playlist' : 'Add New Playlist'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Playlist Name
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration per item (seconds)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Content
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {state.content.length === 0 ? (
                    <p className="text-gray-500">No content available</p>
                  ) : (
                    state.content.map(content => (
                      <div key={content.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          id={content.id}
                          checked={formData.contentIds.includes(content.id)}
                          onChange={(e) => handleContentSelection(content.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={content.id} className="text-sm text-gray-900">
                          {content.name} ({content.type})
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPlaylist(null);
                    setFormData({ name: '', description: '', contentIds: [], duration: 30 });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPlaylist ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}