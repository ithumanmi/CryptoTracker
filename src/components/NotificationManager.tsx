import React, { useState, useEffect } from 'react';
import { AlertHistory } from '../types/crypto';
import { alertService } from '../services/alertService';
import AlertNotification from './AlertNotification';

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<AlertHistory[]>([]);

  useEffect(() => {
    // Check for new alerts every second
    const interval = setInterval(() => {
      const history = alertService.getAlertHistory();
      const recentAlerts = history.filter(alert => 
        alert.triggeredAt > Date.now() - 60000 // Last minute
      );
      
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newAlerts = recentAlerts.filter(alert => !existingIds.has(alert.id));
        return [...prev, ...newAlerts];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <AlertNotification
          key={notification.id}
          alert={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
};

export default NotificationManager; 