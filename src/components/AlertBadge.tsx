import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { alertService } from '../services/alertService';
import { PriceAlert } from '../types/crypto';

interface AlertBadgeProps {
  onClick?: () => void;
  className?: string;
}

const AlertBadge: React.FC<AlertBadgeProps> = ({ onClick, className = '' }) => {
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const updateAlertCount = () => {
      const alerts = alertService.getAlerts();
      setAlertCount(alerts.length);
    };

    // Update count initially
    updateAlertCount();

    // Update count every 5 seconds
    const interval = setInterval(updateAlertCount, 5000);

    return () => clearInterval(interval);
  }, []);

  if (alertCount === 0) return null;

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      <Bell className="w-5 h-5 text-white/60" />
      <span className="absolute -top-1 -right-1 bg-crypto-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
        {alertCount > 99 ? '99+' : alertCount}
      </span>
    </div>
  );
};

export default AlertBadge; 