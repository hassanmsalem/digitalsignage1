import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useApi } from '../hooks/useApi';
import { Image, Plus, Edit2, Trash2, Clock, FileText, Video, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Use window.location.protocol to match the frontend protocol
const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

export default function Content() {
  const { state, dispatch } = useApp();
  const { fetchContent, createContent, updateContent, deleteContent } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'image' as 'image' | 'video' | 'text' | 'url',
    url: '',
    duration: 30,
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContent) {
        await updateContent(editingContent.id, formData, selectedFile || undefined);
      } else {
        await createContent(formData, selectedFile || undefined);
      }
      setShowModal(false);
      setEditingContent(null);
      setSelectedFile(null);
      setFormData({ name: '', type: 'image', url: '', duration: 30 });
    } catch (error) {
      // Error handled by useApi hook
    }
  };

  const handleEdit = (content: any) => {
    setEditingContent(content);
    setFormData({
      name: content.name,
      type: content.type,
      url: content.url,
      duration: content.duration,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      await deleteContent(id);
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'text': return FileText;
      case 'url': return ExternalLink;
      default: return FileText;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content</h1>
          <p className="text-gray-600">Manage your media and content assets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Content</span>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.content.map(content => {
          const IconComponent = getIconByType(content.type);
          return (
            <div key={content.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Preview */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {content.type === 'image' && content.url ? (
                  <img 
                    src={content.url.startsWith('/') ? `${API_BASE_URL}${content.url}` : content.url}
                    alt={content.name}
                    className="w-full h-full object-cover"
                  />
                ) : content.type === 'video' && content.url ? (
                  <video 
                    src={content.url.startsWith('/') ? `${API_BASE_URL}${content.url}` : content.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <IconComponent className="h-12 w-12 text-gray-400" />
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{content.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(content)}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="capitalize">{content.type}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{content.duration}s</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {state.content.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No content uploaded yet</p>
          <p className="text-gray-400">Add your first piece of content to get started</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingContent ? 'Edit Content' : 'Add New Content'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Name
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
                  Content Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="text">Text</option>
                  <option value="url">URL</option>
                </select>
              </div>
              
              {(formData.type === 'image' || formData.type === 'video') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <input
                    type="file"
                    accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              
              {(formData.type === 'url' || formData.type === 'text') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === 'url' ? 'URL' : 'Text Content'}
                  </label>
                  {formData.type === 'url' ? (
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  ) : (
                    <textarea
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      required
                    />
                  )}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Duration (seconds)
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
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingContent(null);
                    setSelectedFile(null);
                    setFormData({ name: '', type: 'image', url: '', duration: 30 });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingContent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}