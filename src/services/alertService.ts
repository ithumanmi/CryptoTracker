import { PriceAlert, AlertHistory, AlertSettings, RealTimePrice } from '../types/crypto';

class AlertService {
  private alerts: PriceAlert[] = [];
  private alertHistory: AlertHistory[] = [];
  private settings: AlertSettings = {
    emailNotifications: true,
    pushNotifications: true,
    telegramNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  };

  // Create new price alert
  createAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): PriceAlert {
    const newAlert: PriceAlert = {
      ...alert,
      id: this.generateId(),
      createdAt: Date.now(),
      active: true
    };

    this.alerts.push(newAlert);
    this.saveAlerts();
    return newAlert;
  }

  // Update existing alert
  updateAlert(id: string, updates: Partial<PriceAlert>): PriceAlert | null {
    const index = this.alerts.findIndex(alert => alert.id === id);
    if (index === -1) return null;

    this.alerts[index] = { ...this.alerts[index], ...updates };
    this.saveAlerts();
    return this.alerts[index];
  }

  // Delete alert
  deleteAlert(id: string): boolean {
    const index = this.alerts.findIndex(alert => alert.id === id);
    if (index === -1) return false;

    this.alerts.splice(index, 1);
    this.saveAlerts();
    return true;
  }

  // Get all alerts
  getAlerts(): PriceAlert[] {
    return this.alerts.filter(alert => alert.active);
  }

  // Get alert history
  getAlertHistory(): AlertHistory[] {
    return this.alertHistory;
  }

  // Check if price triggers any alerts
  checkPriceAlerts(priceData: RealTimePrice): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Check if we're in quiet hours
    if (this.settings.quietHours.enabled) {
      const startTime = this.settings.quietHours.start;
      const endTime = this.settings.quietHours.end;
      
      if (this.isTimeInRange(currentTimeString, startTime, endTime)) {
        return; // Don't send notifications during quiet hours
      }
    }

    this.alerts.forEach(alert => {
      if (!alert.active || alert.symbol !== priceData.symbol) return;

      let shouldTrigger = false;
      let message = '';

      if (alert.type === 'above' && priceData.price >= alert.price) {
        shouldTrigger = true;
        message = `${alert.symbol} đã vượt mốc $${alert.price.toLocaleString()} (Hiện tại: $${priceData.price.toLocaleString()})`;
      } else if (alert.type === 'below' && priceData.price <= alert.price) {
        shouldTrigger = true;
        message = `${alert.symbol} đã giảm xuống $${alert.price.toLocaleString()} (Hiện tại: $${priceData.price.toLocaleString()})`;
      }

      if (shouldTrigger) {
        this.triggerAlert(alert, priceData, message);
      }
    });
  }

  // Trigger alert and send notifications
  private triggerAlert(alert: PriceAlert, priceData: RealTimePrice, message: string): void {
    // Mark alert as triggered
    alert.triggeredAt = Date.now();
    alert.active = false;

    // Add to history
    const historyEntry: AlertHistory = {
      id: this.generateId(),
      alertId: alert.id,
      symbol: alert.symbol,
      triggeredPrice: priceData.price,
      targetPrice: alert.price,
      triggeredAt: Date.now(),
      message
    };

    this.alertHistory.push(historyEntry);

    // Send notifications
    this.sendNotification(alert, message);

    // Save changes
    this.saveAlerts();
    this.saveAlertHistory();
  }

  // Send notification based on alert settings
  private sendNotification(alert: PriceAlert, message: string): void {
    // Browser notification
    if (this.settings.pushNotifications && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Crypto Alert', {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: alert.id
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Crypto Alert', {
              body: message,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: alert.id
            });
          }
        });
      }
    }

    // Sound notification
    if (this.settings.soundEnabled) {
      this.playAlertSound();
    }

    // Vibration (mobile)
    if (this.settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    // Email notification (mock)
    if (this.settings.emailNotifications) {
      this.sendEmailNotification(alert, message);
    }

    // Telegram notification (mock)
    if (this.settings.telegramNotifications) {
      this.sendTelegramNotification(alert, message);
    }
  }

  // Play alert sound
  private playAlertSound(): void {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Fallback: create a simple beep sound
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.setValueAtTime(800, context.currentTime);
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.2);
      });
    } catch (error) {
      console.log('Could not play alert sound');
    }
  }

  // Mock email notification
  private sendEmailNotification(alert: PriceAlert, message: string): void {
    console.log(`Email notification sent: ${message}`);
    // In real implementation, this would send an actual email
  }

  // Mock telegram notification
  private sendTelegramNotification(alert: PriceAlert, message: string): void {
    console.log(`Telegram notification sent: ${message}`);
    // In real implementation, this would send to Telegram bot
  }

  // Update alert settings
  updateSettings(settings: Partial<AlertSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
  }

  // Get current settings
  getSettings(): AlertSettings {
    return { ...this.settings };
  }

  // Check if time is in range (for quiet hours)
  private isTimeInRange(current: string, start: string, end: string): boolean {
    const currentMinutes = this.timeToMinutes(current);
    const startMinutes = this.timeToMinutes(start);
    const endMinutes = this.timeToMinutes(end);

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Handle overnight range (e.g., 22:00 to 08:00)
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Persistence methods
  private saveAlerts(): void {
    localStorage.setItem('crypto_alerts', JSON.stringify(this.alerts));
  }

  private saveAlertHistory(): void {
    localStorage.setItem('crypto_alert_history', JSON.stringify(this.alertHistory));
  }

  private saveSettings(): void {
    localStorage.setItem('crypto_alert_settings', JSON.stringify(this.settings));
  }

  // Load data from localStorage
  loadData(): void {
    try {
      const savedAlerts = localStorage.getItem('crypto_alerts');
      if (savedAlerts) {
        this.alerts = JSON.parse(savedAlerts);
      }

      const savedHistory = localStorage.getItem('crypto_alert_history');
      if (savedHistory) {
        this.alertHistory = JSON.parse(savedHistory);
      }

      const savedSettings = localStorage.getItem('crypto_alert_settings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Error loading alert data:', error);
    }
  }

  // Clear all data
  clearAllData(): void {
    this.alerts = [];
    this.alertHistory = [];
    localStorage.removeItem('crypto_alerts');
    localStorage.removeItem('crypto_alert_history');
    localStorage.removeItem('crypto_alert_settings');
  }
}

// Singleton instance
export const alertService = new AlertService();

// Load data on initialization
alertService.loadData(); 