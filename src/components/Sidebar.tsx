import React, { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  Search, 
  Wallet, 
  Newspaper, 
  Bell,
  Settings,
  Menu,
  X
} from 'lucide-react';
import PriceAlerts from './PriceAlerts';
import AlertBadge from './AlertBadge';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPriceAlerts, setShowPriceAlerts] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'market-analysis', label: 'Market Analysis', icon: TrendingUp },
    { id: 'gem-hunter', label: 'Gem Hunter', icon: Search },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'news', label: 'News', icon: Newspaper },
  ];

  return (
    <>
      <div className={`bg-crypto-dark border-r border-white/10 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-primary-500">CryptoTracker</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isCollapsed ? <Menu className="w-5 h-5 text-white" /> : <X className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activePage === item.id
                        ? 'bg-primary-500 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-white/10">
          <div className="space-y-2">
            <button
              onClick={() => setShowPriceAlerts(true)}
              className="w-full flex items-center space-x-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isCollapsed ? (
                <AlertBadge onClick={() => setShowPriceAlerts(true)} />
              ) : (
                <>
                  <AlertBadge />
                  <span>Price Alerts</span>
                </>
              )}
            </button>
            
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              {!isCollapsed && <span>Settings</span>}
            </button>
          </div>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-white/40">
              <p>Version 1.0.0</p>
              <p>© 2024 CryptoTracker</p>
            </div>
          </div>
        )}
      </div>

      {/* Price Alerts Modal */}
      {showPriceAlerts && (
        <PriceAlerts onClose={() => setShowPriceAlerts(false)} />
      )}
    </>
  );
};

export default Sidebar; 