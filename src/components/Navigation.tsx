import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Monitor, PlaySquare, Image, Home } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/screens', label: 'Screens', icon: Monitor },
    { to: '/playlists', label: 'Playlists', icon: PlaySquare },
    { to: '/content', label: 'Content', icon: Image },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Monitor className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Digital Signage</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}