import React, { useState, useEffect } from 'react';
import { X, Bell, Volume2 } from 'lucide-react';
import { AlertHistory } from '../types/crypto';

interface AlertNotificationProps {
  alert: AlertHistory;
  onClose: () => void;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification with animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto hide after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getPriceChange = () => {
    const change = alert.triggeredPrice - alert.targetPrice;
    const percentChange = (change / alert.targetPrice) * 100;
    return {
      value: change,
      percent: percentChange,
      isPositive: change > 0
    };
  };

  const priceChange = getPriceChange();

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-crypto-dark border border-white/10 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-crypto-red/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-crypto-red" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Price Alert Triggered</h4>
              <button
                onClick={handleClose}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-white/80 mt-1">{alert.message}</p>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Target Price:</span>
                <span className="text-white font-medium">${alert.targetPrice.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Actual Price:</span>
                <span className="text-white font-medium">${alert.triggeredPrice.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Difference:</span>
                <span className={`font-medium ${
                  priceChange.isPositive ? 'text-crypto-green' : 'text-crypto-red'
                }`}>
                  {priceChange.isPositive ? '+' : ''}${priceChange.value.toFixed(2)} ({priceChange.percent.toFixed(2)}%)
                </span>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-white/40">
              {new Date(alert.triggeredAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertNotification; 