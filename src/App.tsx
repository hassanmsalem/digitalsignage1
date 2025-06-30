import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Screens from './pages/Screens';
import Playlists from './pages/Playlists';
import Content from './pages/Content';
import Display from './pages/Display';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public display route */}
          <Route path="/display/:id" element={<Display />} />
          
          {/* Admin routes with navigation */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/screens" element={<Screens />} />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/content" element={<Content />} />
                </Routes>
              </div>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;