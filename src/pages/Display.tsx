import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { displayApi } from '../services/api';
import { Content } from '../contexts/AppContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || `http://localhost:10000`;

export default function Display() {
  const { id } = useParams<{ id: string }>();
  const [displayData, setDisplayData] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastContentCount, setLastContentCount] = useState(0);

  useEffect(() => {
    const fetchDisplayData = async () => {
      if (!id) return;
      
      try {
        const data = await displayApi.getDisplayData(id);
        setDisplayData(data);
        setError(null);
        
        // Check if content count changed (new items added to playlist)
        if (data.content && data.content.length !== lastContentCount) {
          setLastContentCount(data.content.length);
          // Reset to first item if content changed
          if (data.content.length > 0) {
            setCurrentIndex(0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch display data:', error);
        setError('Failed to load display data');
      } finally {
        setLoading(false);
      }
    };

    fetchDisplayData();
    
    // Refresh data every 10 seconds to catch playlist updates quickly
    const interval = setInterval(fetchDisplayData, 10000);
    return () => clearInterval(interval);
  }, [id, lastContentCount]);

  useEffect(() => {
    if (!displayData?.content?.length) return;

    const content = displayData.content[currentIndex];
    const duration = (content?.duration || displayData.playlist?.duration || 30) * 1000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % displayData.content.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, displayData]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading display...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-2xl">{error}</div>
      </div>
    );
  }

  if (!displayData?.screen) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Screen not found</div>
      </div>
    );
  }

  if (!displayData.content?.length) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">{displayData.screen.name}</h1>
          <p className="text-xl opacity-80">No content assigned to this screen</p>
        </div>
      </div>
    );
  }

  const currentContent: Content = displayData.content[currentIndex];

  const renderContent = () => {
    switch (currentContent.type) {
      case 'image':
        return (
          <img
            src={currentContent.url.startsWith('/') ? `${API_BASE_URL}${currentContent.url}` : currentContent.url}
            alt={currentContent.name}
            className="w-full h-full object-contain"
          />
        );
      
      case 'video':
        return (
          <video
            src={currentContent.url.startsWith('/') ? `${API_BASE_URL}${currentContent.url}` : currentContent.url}
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
          />
        );
      
      case 'text':
        return (
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="text-white text-center max-w-4xl">
              <h2 className="text-4xl font-bold mb-8">{currentContent.name}</h2>
              <div className="text-2xl leading-relaxed whitespace-pre-wrap">
                {currentContent.url}
              </div>
            </div>
          </div>
        );
      
      case 'url':
        return (
          <iframe
            src={currentContent.url}
            className="w-full h-full border-0"
            title={currentContent.name}
          />
        );
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{currentContent.name}</h2>
              <p>Unsupported content type: {currentContent.type}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-black overflow-hidden">
      {renderContent()}
    </div>
  );
}