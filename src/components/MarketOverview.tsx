import React from 'react';
import { TrendingUp, TrendingDown, Globe, Activity } from 'lucide-react';
import { MarketData } from '../types/crypto';

interface MarketOverviewProps {
  data: MarketData;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ data }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  const isMarketUp = data.market_cap_change_percentage_24h_usd >= 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-semibold text-white">Tổng Quan Thị Trường</h2>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          isMarketUp 
            ? 'bg-crypto-green/20 text-crypto-green' 
            : 'bg-crypto-red/20 text-crypto-red'
        }`}>
          {isMarketUp ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {Math.abs(data.market_cap_change_percentage_24h_usd).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-full mx-auto mb-4">
            <Activity className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Tổng Market Cap</h3>
          <p className="text-2xl font-bold text-white mb-1">
            {formatNumber(data.total_market_cap)}
          </p>
          <p className="text-sm text-white/60">Tổng vốn hóa thị trường</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-crypto-yellow/20 rounded-full mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-crypto-yellow" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">24h Volume</h3>
          <p className="text-2xl font-bold text-white mb-1">
            {formatNumber(data.total_volume)}
          </p>
          <p className="text-sm text-white/60">Khối lượng giao dịch 24h</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-crypto-purple/20 rounded-full mx-auto mb-4">
            <Globe className="w-8 h-8 text-crypto-purple" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Market Dominance</h3>
          <div className="space-y-2">
            {Object.entries(data.market_cap_percentage)
              .slice(0, 3)
              .map(([coin, percentage]) => (
                <div key={coin} className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{coin.toUpperCase()}</span>
                  <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Market Sentiment */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Tâm Lý Thị Trường</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Bullish</span>
              <span className="text-sm text-crypto-green font-medium">65%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-crypto-green h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Bearish</span>
              <span className="text-sm text-crypto-red font-medium">35%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-crypto-red h-2 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview; 