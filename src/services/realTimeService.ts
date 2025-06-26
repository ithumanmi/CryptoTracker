import { io, Socket } from 'socket.io-client';
import { RealTimePrice, WebSocketMessage, PriceAlert } from '../types/crypto';
import { alertService } from './alertService';

class RealTimeService {
  private socket: Socket | null = null;
  private subscribers = new Map<string, Set<(data: any) => void>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      // Use mock WebSocket for development
      this.socket = {
        on: (event: string, callback: (data: any) => void) => {
          if (event === 'connect') {
            setTimeout(() => callback({}), 100);
          } else if (event === 'price_update') {
            // Simulate price updates
            setInterval(() => {
              const mockPriceData: RealTimePrice = {
                symbol: ['BTC', 'ETH', 'ADA', 'DOT', 'LINK'][Math.floor(Math.random() * 5)],
                price: Math.random() * 50000 + 1000,
                change24h: (Math.random() - 0.5) * 20,
                changePercent24h: (Math.random() - 0.5) * 10,
                volume24h: Math.random() * 1000000000,
                marketCap: Math.random() * 1000000000000,
                timestamp: Date.now()
              };
              
              callback(mockPriceData);
              
              // Check for price alerts
              alertService.checkPriceAlerts(mockPriceData);
            }, 5000);
          }
        },
        emit: () => {},
        disconnect: () => {}
      } as any;

      if (this.socket) {
        this.socket.on('connect', () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.notifySubscribers('connect', {});
        });

        this.socket.on('disconnect', () => {
          console.log('WebSocket disconnected');
          this.notifySubscribers('disconnect', {});
          this.handleReconnect();
        });

        this.socket.on('error', (error: any) => {
          console.error('WebSocket error:', error);
          this.handleReconnect();
        });
      }

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.initializeSocket();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const eventSubscribers = this.subscribers.get(event);
      if (eventSubscribers) {
        eventSubscribers.delete(callback);
        if (eventSubscribers.size === 0) {
          this.subscribers.delete(event);
        }
      }
    };
  }

  public unsubscribe(event: string, callback: (data: any) => void): void {
    const eventSubscribers = this.subscribers.get(event);
    if (eventSubscribers) {
      eventSubscribers.delete(callback);
      if (eventSubscribers.size === 0) {
        this.subscribers.delete(event);
      }
    }
  }

  private notifySubscribers(event: string, data: any) {
    const eventSubscribers = this.subscribers.get(event);
    if (eventSubscribers) {
      eventSubscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Price Alert Management
  public createPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): PriceAlert {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    };

    // Store alert in localStorage for persistence
    const alerts = this.getStoredAlerts();
    alerts.push(newAlert);
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));

    return newAlert;
  }

  public getStoredAlerts(): PriceAlert[] {
    const stored = localStorage.getItem('priceAlerts');
    return stored ? JSON.parse(stored) : [];
  }

  public deleteAlert(alertId: string) {
    const alerts = this.getStoredAlerts().filter(alert => alert.id !== alertId);
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  }

  public updateAlert(alertId: string, updates: Partial<PriceAlert>) {
    const alerts = this.getStoredAlerts().map(alert => 
      alert.id === alertId ? { ...alert, ...updates } : alert
    );
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  }
}

// Singleton instance
export const realTimeService = new RealTimeService();
export default realTimeService; 