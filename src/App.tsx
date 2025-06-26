import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MarketAnalysis from './pages/MarketAnalysis';
import GemHunter from './pages/GemHunter';
import Portfolio from './pages/Portfolio';
import News from './pages/News';
import NotificationManager from './components/NotificationManager';
import './index.css';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'market-analysis':
        return <MarketAnalysis />;
      case 'gem-hunter':
        return <GemHunter />;
      case 'portfolio':
        return <Portfolio />;
      case 'news':
        return <News />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-crypto-dark">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
      <NotificationManager />
    </div>
  );
};

export default App; 