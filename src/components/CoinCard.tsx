import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoCurrency } from '../types/crypto';

interface CoinCardProps {
  coin: CryptoCurrency;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return price.toFixed(8);
    } else if (price < 1) {
      return price.toFixed(4);
    } else {
      return price.toFixed(2);
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <div className="card hover:bg-white/10 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={coin.image} 
            alt={coin.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-white">{coin.name}</h3>
            <p className="text-sm text-white/60">{coin.symbol.toUpperCase()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">#{coin.market_cap_rank}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">Price</span>
          <span className="font-mono font-semibold text-white">
            ${formatPrice(coin.current_price)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">Market Cap</span>
          <span className="font-mono text-white">
            {formatMarketCap(coin.market_cap)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">24h Change</span>
          <div className={`flex items-center space-x-1 ${
            isPositive ? 'text-crypto-green' : 'text-crypto-red'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-semibold">
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">Volume</span>
          <span className="font-mono text-white">
            {formatMarketCap(coin.total_volume)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CoinCard; 