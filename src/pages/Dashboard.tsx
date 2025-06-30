import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useApi } from '../hooks/useApi';
import { Monitor, PlaySquare, Image, Activity } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const { fetchScreens, fetchPlaylists, fetchContent } = useApi();

  useEffect(() => {
    fetchScreens();
    fetchPlaylists();
    fetchContent();
  }, []);

  if (state.loading) return <LoadingSpinner />;

  const activeScreens = state.screens.filter(s => s.isActive).length;
  const totalScreens = state.screens.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {state.error && (
        <ErrorMessage 
          message={state.error} 
          onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
        />
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your digital signage network</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Screens</p>
              <p className="text-2xl font-bold text-green-600">{activeScreens}</p>
            </div>
            <Activity className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Screens</p>
              <p className="text-2xl font-bold text-blue-600">{totalScreens}</p>
            </div>
            <Monitor className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Playlists</p>
              <p className="text-2xl font-bold text-purple-600">{state.playlists.length}</p>
            </div>
            <PlaySquare className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Content Items</p>
              <p className="text-2xl font-bold text-orange-600">{state.content.length}</p>
            </div>
            <Image className="h-10 w-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Screens</h2>
          <div className="space-y-3">
            {state.screens.slice(0, 5).map(screen => (
              <div key={screen.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{screen.name}</p>
                  <p className="text-sm text-gray-600">{screen.location}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  screen.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {screen.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            ))}
            {state.screens.length === 0 && (
              <p className="text-gray-500 text-center py-4">No screens configured yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Playlists</h2>
          <div className="space-y-3">
            {state.playlists.slice(0, 5).map(playlist => (
              <div key={playlist.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{playlist.name}</p>
                  <p className="text-sm text-gray-600">{playlist.contentIds.length} items</p>
                </div>
                <div className="text-sm text-gray-500">
                  {playlist.duration}s
                </div>
              </div>
            ))}
            {state.playlists.length === 0 && (
              <p className="text-gray-500 text-center py-4">No playlists created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}