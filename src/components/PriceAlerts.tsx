import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit, Trash2, Settings, Clock, Volume2, VolumeX } from 'lucide-react';
import { PriceAlert, AlertHistory, AlertSettings } from '../types/crypto';
import { alertService } from '../services/alertService';
import { cryptoApi } from '../services/cryptoApi';

interface PriceAlertsProps {
  onClose?: () => void;
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({ onClose }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [history, setHistory] = useState<AlertHistory[]>([]);
  const [settings, setSettings] = useState<AlertSettings>(alertService.getSettings());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'above' as 'above' | 'below',
    price: '',
    description: '',
    notificationType: 'both' as 'email' | 'push' | 'both'
  });

  useEffect(() => {
    loadData();
    loadCoins();
  }, []);

  const loadData = () => {
    setAlerts(alertService.getAlerts());
    setHistory(alertService.getAlertHistory());
    setSettings(alertService.getSettings());
  };

  const loadCoins = async () => {
    try {
      const topCoins = await cryptoApi.getTopCoins(50);
      setCoins(topCoins);
    } catch (error) {
      console.error('Error loading coins:', error);
    }
  };

  const handleCreateAlert = () => {
    if (!formData.symbol || !formData.price) return;

    const newAlert = alertService.createAlert({
      symbol: formData.symbol.toUpperCase(),
      type: formData.type,
      price: parseFloat(formData.price),
      description: formData.description,
      notificationType: formData.notificationType,
      active: true
    });

    setAlerts(alertService.getAlerts());
    setShowCreateForm(false);
    setFormData({
      symbol: '',
      type: 'above',
      price: '',
      description: '',
      notificationType: 'both'
    });
  };

  const handleDeleteAlert = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa alert này?')) {
      alertService.deleteAlert(id);
      setAlerts(alertService.getAlerts());
    }
  };

  const handleUpdateSettings = (newSettings: Partial<AlertSettings>) => {
    alertService.updateSettings(newSettings);
    setSettings(alertService.getSettings());
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  const getAlertStatus = (alert: PriceAlert) => {
    if (alert.triggeredAt) {
      return <span className="text-crypto-green text-sm">Đã kích hoạt</span>;
    }
    return <span className="text-crypto-yellow text-sm">Đang theo dõi</span>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-crypto-dark border border-white/10 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-white">Price Alerts</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-white/60" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Create Alert Button */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo Alert
              </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">Chưa có alert nào</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                          <span className="text-primary-500 font-bold">{alert.symbol}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white">{alert.symbol}</span>
                            <span className={`text-sm px-2 py-1 rounded ${
                              alert.type === 'above' 
                                ? 'bg-crypto-green/20 text-crypto-green' 
                                : 'bg-crypto-red/20 text-crypto-red'
                            }`}>
                              {alert.type === 'above' ? 'Trên' : 'Dưới'} ${alert.price.toLocaleString()}
                            </span>
                          </div>
                          {alert.description && (
                            <p className="text-sm text-white/60 mt-1">{alert.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            {getAlertStatus(alert)}
                            <span className="text-xs text-white/40">
                              Tạo: {formatDate(alert.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-2 hover:bg-crypto-red/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-crypto-red" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Alert History */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Alert History</h3>
              <div className="space-y-3">
                {history.slice(0, 10).map((item) => (
                  <div key={item.id} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{item.message}</p>
                        <p className="text-sm text-white/60">
                          {formatDate(item.triggeredAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/60">Target: ${item.targetPrice.toLocaleString()}</p>
                        <p className="text-sm text-white/60">Actual: ${item.triggeredPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="w-80 p-6 border-l border-white/10 bg-crypto-darker">
              <h3 className="text-lg font-semibold text-white mb-4">Alert Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleUpdateSettings({ pushNotifications: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-white">Push Notifications</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleUpdateSettings({ emailNotifications: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-white">Email Notifications</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => handleUpdateSettings({ soundEnabled: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-white">Sound Alerts</span>
                    {settings.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-white/60" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-white/60" />
                    )}
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.vibrationEnabled}
                      onChange={(e) => handleUpdateSettings({ vibrationEnabled: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-white">Vibration</span>
                  </label>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={settings.quietHours.enabled}
                      onChange={(e) => handleUpdateSettings({ 
                        quietHours: { ...settings.quietHours, enabled: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-white">Quiet Hours</span>
                    <Clock className="w-4 h-4 text-white/60" />
                  </label>
                  
                  {settings.quietHours.enabled && (
                    <div className="ml-6 space-y-2">
                      <div>
                        <label className="text-sm text-white/60">Start Time</label>
                        <input
                          type="time"
                          value={settings.quietHours.start}
                          onChange={(e) => handleUpdateSettings({
                            quietHours: { ...settings.quietHours, start: e.target.value }
                          })}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/60">End Time</label>
                        <input
                          type="time"
                          value={settings.quietHours.end}
                          onChange={(e) => handleUpdateSettings({
                            quietHours: { ...settings.quietHours, end: e.target.value }
                          })}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Alert Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-crypto-dark border border-white/10 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Tạo Price Alert</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60">Coin</label>
                  <select
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  >
                    <option value="">Chọn coin</option>
                    {coins.map((coin) => (
                      <option key={coin.symbol} value={coin.symbol}>
                        {coin.symbol.toUpperCase()} - {coin.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/60">Loại Alert</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'above' | 'below' })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  >
                    <option value="above">Giá trên</option>
                    <option value="below">Giá dưới</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/60">Giá ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Nhập giá..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60">Mô tả (tùy chọn)</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả alert..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60">Thông báo</label>
                  <select
                    value={formData.notificationType}
                    onChange={(e) => setFormData({ ...formData, notificationType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  >
                    <option value="both">Push + Email</option>
                    <option value="push">Chỉ Push</option>
                    <option value="email">Chỉ Email</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateAlert}
                  className="btn-primary"
                >
                  Tạo Alert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceAlerts; 