import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Users, Activity, Wifi, WifiOff } from 'lucide-react';
import { CryptoCurrency, MarketData, RealTimePrice } from '../types/crypto';
import { cryptoApi } from '../services/cryptoApi';
import { realTimeService } from '../services/realTimeService';
import CoinCard from '../components/CoinCard';
import MarketOverview from '../components/MarketOverview';
import AIInsights from '../components/AIInsights';

const Dashboard: React.FC = () => {
  const [topCoins, setTopCoins] = useState<CryptoCurrency[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState<RealTimePrice[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('BTC');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coins, market] = await Promise.all([
          cryptoApi.getTopCoins(20),
          cryptoApi.getGlobalMarketData()
        ]);
        setTopCoins(coins);
        setMarketData(market);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Real-time updates
  useEffect(() => {
    const unsubscribePrice = realTimeService.subscribe('price_update', (data: RealTimePrice) => {
      setRealTimeData(prev => {
        const existing = prev.find(item => item.symbol === data.symbol);
        if (existing) {
          return prev.map(item => item.symbol === data.symbol ? data : item);
        } else {
          return [...prev, data];
        }
      });
    });

    const unsubscribeMarket = realTimeService.subscribe('market_update', (data: any) => {
      if (marketData) {
        setMarketData(prev => prev ? {
          ...prev,
          total_market_cap: data.totalMarketCap || prev.total_market_cap,
          total_volume: data.totalVolume || prev.total_volume,
          market_cap_change_percentage_24h_usd: data.marketChange || prev.market_cap_change_percentage_24h_usd
        } : null);
      }
    });

    // Connection status
    const checkConnection = () => {
      setIsConnected(true);
    };

    realTimeService.subscribe('connect', checkConnection);
    realTimeService.subscribe('disconnect', () => setIsConnected(false));

    return () => {
      unsubscribePrice();
      unsubscribeMarket();
    };
  }, [marketData]);

  // Update coin prices with real-time data
  const getUpdatedCoins = () => {
    return topCoins.map(coin => {
      const realTimeCoin = realTimeData.find(rt => rt.symbol === coin.symbol.toUpperCase());
      if (realTimeCoin) {
        return {
          ...coin,
          current_price: realTimeCoin.price,
          price_change_24h: realTimeCoin.change24h,
          price_change_percentage_24h: realTimeCoin.changePercent24h,
          total_volume: realTimeCoin.volume24h,
          market_cap: realTimeCoin.marketCap
        };
      }
      return coin;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const updatedCoins = getUpdatedCoins();

  return (
    <div className="p-6 space-y-6">
      {/* Header with Connection Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/60">Tổng quan thị trường crypto</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-crypto-green" />
            ) : (
              <WifiOff className="w-5 h-5 text-crypto-red" />
            )}
            <span className={`text-sm ${isConnected ? 'text-crypto-green' : 'text-crypto-red'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          <button className="btn-primary">
            <Activity className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Market Overview */}
      {marketData && <MarketOverview data={marketData} />}

      {/* AI Insights for Selected Coin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">AI Insights</h2>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
              >
                {updatedCoins.slice(0, 10).map(coin => (
                  <option key={coin.symbol} value={coin.symbol}>
                    {coin.symbol.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <AIInsights symbol={selectedCoin} />
          </div>
        </div>

        {/* Real-time Price Updates */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Real-time Updates</h2>
          <div className="space-y-3">
            {realTimeData.slice(0, 8).map((data) => (
              <div key={data.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="font-medium text-white">{data.symbol}</p>
                  <p className="text-sm text-white/60">${data.price.toLocaleString()}</p>
                </div>
                <div className={`text-right ${data.changePercent24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                  <p className="font-semibold">
                    {data.changePercent24h >= 0 ? '+' : ''}{data.changePercent24h.toFixed(2)}%
                  </p>
                  <p className="text-xs text-white/60">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Coins with Real-time Data */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Top 20 Coins</h2>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-crypto-green" />
            <span className="text-white/60">Market Cap</span>
            {isConnected && (
              <div className="w-2 h-2 bg-crypto-green rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {updatedCoins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
      </div>

      {/* Quick Stats with Real-time Updates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Market Cap</p>
              <p className="text-2xl font-bold text-white">
                ${marketData?.total_market_cap?.toLocaleString() || '0'}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">24h Volume</p>
              <p className="text-2xl font-bold text-white">
                ${marketData?.total_volume?.toLocaleString() || '0'}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-crypto-yellow" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Coins</p>
              <p className="text-2xl font-bold text-white">2,295</p>
            </div>
            <Users className="w-8 h-8 text-crypto-purple" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Market Change</p>
              <p className={`text-2xl font-bold ${
                (marketData?.market_cap_change_percentage_24h_usd || 0) >= 0 
                  ? 'text-crypto-green' 
                  : 'text-crypto-red'
              }`}>
                {marketData?.market_cap_change_percentage_24h_usd?.toFixed(2) || '0'}%
              </p>
            </div>
            {(marketData?.market_cap_change_percentage_24h_usd || 0) >= 0 ? (
              <TrendingUp className="w-8 h-8 text-crypto-green" />
            ) : (
              <TrendingDown className="w-8 h-8 text-crypto-red" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 