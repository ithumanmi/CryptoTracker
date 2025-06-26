import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { CryptoCurrency, CandlestickData, TechnicalIndicators } from '../types/crypto';
import { cryptoApi } from '../services/cryptoApi';
import { calculateAllIndicators } from '../services/technicalAnalysis';
import { realTimeService } from '../services/realTimeService';
import AdvancedChart from '../components/AdvancedChart';
import CoinCard from '../components/CoinCard';

const MarketAnalysis: React.FC = () => {
  const [coins, setCoins] = useState<CryptoCurrency[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<CryptoCurrency[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCurrency | null>(null);
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [technicalData, setTechnicalData] = useState<TechnicalIndicators | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'market_cap' | 'volume' | 'change'>('market_cap');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M'>('1M');
  const [showSignals, setShowSignals] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await cryptoApi.getAllCoins();
        setCoins(data);
        setFilteredCoins(data);
        if (data.length > 0) {
          setSelectedCoin(data[0]);
        }
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Real-time connection status
  useEffect(() => {
    const checkConnection = () => setIsConnected(true);
    realTimeService.subscribe('connect', checkConnection);
    realTimeService.subscribe('disconnect', () => setIsConnected(false));

    return () => {
      realTimeService.unsubscribe('connect', checkConnection);
      realTimeService.unsubscribe('disconnect', () => setIsConnected(false));
    };
  }, []);

  // Fetch chart data when coin or timeframe changes
  useEffect(() => {
    if (!selectedCoin) return;

    const fetchChartData = async () => {
      try {
        const data = await cryptoApi.getCandlestickData(selectedCoin.symbol, timeframe);
        setChartData(data);
        
        // Calculate technical indicators
        const indicators = calculateAllIndicators(data);
        setTechnicalData(indicators);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [selectedCoin, timeframe]);

  // Filter and sort coins
  useEffect(() => {
    let filtered = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'market_cap':
          return (b.market_cap || 0) - (a.market_cap || 0);
        case 'volume':
          return (b.total_volume || 0) - (a.total_volume || 0);
        case 'change':
          return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
        default:
          return 0;
      }
    });

    setFilteredCoins(filtered);
  }, [coins, searchTerm, sortBy]);

  const getSignalColor = (signal: string) => {
    if (signal.includes('Buy') || signal.includes('Bullish')) return 'text-crypto-green';
    if (signal.includes('Sell') || signal.includes('Bearish')) return 'text-crypto-red';
    return 'text-crypto-yellow';
  };

  const getSignalIcon = (signal: string) => {
    if (signal.includes('Buy') || signal.includes('Bullish')) return <TrendingUp className="w-4 h-4" />;
    if (signal.includes('Sell') || signal.includes('Bearish')) return <TrendingDown className="w-4 h-4" />;
    return <BarChart3 className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Market Analysis</h1>
          <p className="text-white/60">Advanced technical analysis and market insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-crypto-green' : 'bg-crypto-red'}`}></div>
            <span className="text-sm text-white/60">
              {isConnected ? 'Live Data' : 'Offline'}
            </span>
          </div>
          <button className="btn-primary">
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coin List */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Coins</h2>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm w-32"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-4 h-4 text-white/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
              >
                <option value="market_cap">Market Cap</option>
                <option value="volume">Volume</option>
                <option value="change">24h Change</option>
              </select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCoins.slice(0, 50).map((coin) => (
                <div
                  key={coin.id}
                  onClick={() => setSelectedCoin(coin)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCoin?.id === coin.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{coin.symbol.toUpperCase()}</p>
                      <p className="text-sm text-white/60">{coin.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${coin.current_price?.toLocaleString()}</p>
                      <p className={`text-sm ${
                        (coin.price_change_percentage_24h || 0) >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                      }`}>
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart and Analysis */}
        <div className="lg:col-span-3 space-y-6">
          {/* Advanced Chart */}
          {selectedCoin && chartData.length > 0 && (
            <AdvancedChart
              data={chartData}
              symbol={selectedCoin.symbol.toUpperCase()}
              height={400}
              showVolume={true}
              showIndicators={true}
            />
          )}

          {/* Technical Indicators */}
          {technicalData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Technical Indicators</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm">RSI</p>
                      <p className={`text-lg font-semibold ${
                        technicalData.rsi > 70 ? 'text-crypto-red' : 
                        technicalData.rsi < 30 ? 'text-crypto-green' : 'text-white'
                      }`}>
                        {technicalData.rsi.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">MACD</p>
                      <p className={`text-lg font-semibold ${
                        technicalData.macd.histogram > 0 ? 'text-crypto-green' : 'text-crypto-red'
                      }`}>
                        {technicalData.macd.histogram.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Stochastic %K</p>
                      <p className={`text-lg font-semibold ${
                        technicalData.stochastic.k > 80 ? 'text-crypto-red' : 
                        technicalData.stochastic.k < 20 ? 'text-crypto-green' : 'text-white'
                      }`}>
                        {technicalData.stochastic.k.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Williams %R</p>
                      <p className={`text-lg font-semibold ${
                        technicalData.williamsR > -20 ? 'text-crypto-red' : 
                        technicalData.williamsR < -80 ? 'text-crypto-green' : 'text-white'
                      }`}>
                        {technicalData.williamsR.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trading Signals */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Trading Signals</h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showSignals}
                      onChange={(e) => setShowSignals(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-white/60">Show Signals</span>
                  </label>
                </div>
                
                {showSignals && technicalData.signals && (
                  <div className="space-y-3">
                    {technicalData.signals.map((signal, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className={`${getSignalColor(signal)}`}>
                          {getSignalIcon(signal)}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${getSignalColor(signal)}`}>{signal}</p>
                          <p className="text-sm text-white/60">
                            {signal.includes('RSI') ? 'Momentum indicator' :
                             signal.includes('MACD') ? 'Trend indicator' :
                             signal.includes('Stochastic') ? 'Oscillator' :
                             signal.includes('Williams') ? 'Oversold/Overbought' : 'Technical signal'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Support/Resistance Levels */}
          {technicalData && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Support & Resistance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white/80 font-medium mb-3">Support Levels</h4>
                  <div className="space-y-2">
                    {technicalData.supportLevels?.map((level, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-crypto-green/10 rounded">
                        <span className="text-crypto-green font-medium">S{index + 1}</span>
                        <span className="text-white">${level.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white/80 font-medium mb-3">Resistance Levels</h4>
                  <div className="space-y-2">
                    {technicalData.resistanceLevels?.map((level, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-crypto-red/10 rounded">
                        <span className="text-crypto-red font-medium">R{index + 1}</span>
                        <span className="text-white">${level.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis; 