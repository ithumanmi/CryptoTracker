import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Star, Zap, Target, Activity, Wifi, WifiOff } from 'lucide-react';
import { CryptoCurrency, GemData, AIInsight } from '../types/crypto';
import { cryptoApi } from '../services/cryptoApi';
import { aiService } from '../services/aiService';
import { realTimeService } from '../services/realTimeService';
import CoinCard from '../components/CoinCard';
import AIInsights from '../components/AIInsights';

const GemHunter: React.FC = () => {
  const [allCoins, setAllCoins] = useState<CryptoCurrency[]>([]);
  const [gems, setGems] = useState<GemData[]>([]);
  const [filteredGems, setFilteredGems] = useState<GemData[]>([]);
  const [selectedGem, setSelectedGem] = useState<GemData | null>(null);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterPotential, setFilterPotential] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'potential' | 'risk' | 'market_cap' | 'volume'>('potential');
  const [isConnected, setIsConnected] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coins = await cryptoApi.getAllCoins();
        setAllCoins(coins);
        
        // Generate mock gem data
        const gemData = generateGemData(coins);
        setGems(gemData);
        setFilteredGems(gemData);
        
        if (gemData.length > 0) {
          setSelectedGem(gemData[0]);
        }
      } catch (error) {
        console.error('Error fetching gem data:', error);
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

  // Fetch AI insights for selected gem
  useEffect(() => {
    if (!selectedGem) return;

    const fetchAIInsight = async () => {
      try {
        const insight = await aiService.getInsights(selectedGem.symbol);
        setAiInsight(insight);
      } catch (error) {
        console.error('Error fetching AI insight:', error);
      }
    };

    fetchAIInsight();
  }, [selectedGem]);

  // Filter and sort gems
  useEffect(() => {
    let filtered = gems.filter(gem =>
      gem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gem.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply risk filter
    if (filterRisk !== 'all') {
      filtered = filtered.filter(gem => gem.riskLevel === filterRisk);
    }

    // Apply potential filter
    if (filterPotential !== 'all') {
      filtered = filtered.filter(gem => gem.potential === filterPotential);
    }

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'potential':
          return getPotentialScore(b.potential) - getPotentialScore(a.potential);
        case 'risk':
          return getRiskScore(a.riskLevel) - getRiskScore(b.riskLevel);
        case 'market_cap':
          return (b.marketCap || 0) - (a.marketCap || 0);
        case 'volume':
          return (b.volume24h || 0) - (a.volume24h || 0);
        default:
          return 0;
      }
    });

    setFilteredGems(filtered);
  }, [gems, searchTerm, filterRisk, filterPotential, sortBy]);

  const generateGemData = (coins: CryptoCurrency[]): GemData[] => {
    return coins.slice(100, 300).map((coin, index) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      currentPrice: coin.current_price || 0,
      marketCap: coin.market_cap || 0,
      volume24h: coin.total_volume || 0,
      priceChange24h: coin.price_change_percentage_24h || 0,
      potential: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      onChainMetrics: {
        activeAddresses: Math.floor(Math.random() * 10000) + 100,
        transactionCount: Math.floor(Math.random() * 50000) + 1000,
        networkGrowth: (Math.random() - 0.5) * 20,
        developerActivity: Math.floor(Math.random() * 100) + 10
      },
      socialMetrics: {
        twitterFollowers: Math.floor(Math.random() * 100000) + 1000,
        telegramMembers: Math.floor(Math.random() * 50000) + 500,
        redditSubscribers: Math.floor(Math.random() * 10000) + 100,
        sentiment: (Math.random() - 0.5) * 2
      },
      defiMetrics: {
        tvl: Math.floor(Math.random() * 1000000) + 10000,
        apy: Math.random() * 50 + 5,
        liquidity: Math.floor(Math.random() * 500000) + 5000,
        protocolCount: Math.floor(Math.random() * 20) + 1
      },
      nftMetrics: {
        floorPrice: Math.random() * 10 + 0.1,
        volume24h: Math.floor(Math.random() * 1000000) + 10000,
        uniqueHolders: Math.floor(Math.random() * 10000) + 100,
        collectionCount: Math.floor(Math.random() * 100) + 10
      },
      signals: [
        'Strong community growth',
        'Developer activity increasing',
        'Institutional interest detected',
        'Technical breakout pattern',
        'Social sentiment positive'
      ].slice(0, Math.floor(Math.random() * 3) + 2),
      alerts: [
        'Price approaching resistance',
        'Volume spike detected',
        'Whale accumulation',
        'News catalyst expected'
      ].slice(0, Math.floor(Math.random() * 2) + 1)
    }));
  };

  const getPotentialScore = (potential: string) => {
    switch (potential) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  const getRiskScore = (risk: string) => {
    switch (risk) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      default: return 2;
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'text-crypto-green';
      case 'medium': return 'text-crypto-yellow';
      case 'low': return 'text-crypto-red';
      default: return 'text-white';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-crypto-green';
      case 'medium': return 'text-crypto-yellow';
      case 'high': return 'text-crypto-red';
      default: return 'text-white';
    }
  };

  const startScanning = async () => {
    setScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      const newGems = generateGemData(allCoins);
      setGems(newGems);
      setScanning(false);
    }, 3000);
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
          <h1 className="text-3xl font-bold text-white">Gem Hunter</h1>
          <p className="text-white/60">Discover hidden gems and potential moonshots</p>
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
          <button 
            onClick={startScanning}
            disabled={scanning}
            className="btn-primary flex items-center"
          >
            {scanning ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {scanning ? 'Scanning...' : 'Scan for Gems'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Gem List */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Hidden Gems</h2>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search gems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm w-32"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-white/60 text-sm">Risk Level</label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value as any)}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm mt-1"
                >
                  <option value="all">All Risks</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
              
              <div>
                <label className="text-white/60 text-sm">Potential</label>
                <select
                  value={filterPotential}
                  onChange={(e) => setFilterPotential(e.target.value as any)}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm mt-1"
                >
                  <option value="all">All Potential</option>
                  <option value="high">High Potential</option>
                  <option value="medium">Medium Potential</option>
                  <option value="low">Low Potential</option>
                </select>
              </div>

              <div>
                <label className="text-white/60 text-sm">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm mt-1"
                >
                  <option value="potential">Potential</option>
                  <option value="risk">Risk</option>
                  <option value="market_cap">Market Cap</option>
                  <option value="volume">Volume</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredGems.slice(0, 30).map((gem) => (
                <div
                  key={gem.id}
                  onClick={() => setSelectedGem(gem)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedGem?.id === gem.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{gem.symbol.toUpperCase()}</p>
                      <p className="text-sm text-white/60">{gem.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${gem.currentPrice.toLocaleString()}</p>
                      <p className={`text-sm ${
                        gem.priceChange24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                      }`}>
                        {gem.priceChange24h >= 0 ? '+' : ''}{gem.priceChange24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`${getPotentialColor(gem.potential)}`}>
                        <Star className="w-3 h-3 inline mr-1" />
                        {gem.potential}
                      </span>
                      <span className={`${getRiskColor(gem.riskLevel)}`}>
                        <Target className="w-3 h-3 inline mr-1" />
                        {gem.riskLevel}
                      </span>
                    </div>
                    <span className="text-white/60">
                      ${gem.marketCap.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gem Details and AI Insights */}
        <div className="lg:col-span-3 space-y-6">
          {selectedGem && (
            <>
              {/* Gem Overview */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedGem.name}</h2>
                    <p className="text-white/60">{selectedGem.symbol.toUpperCase()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-white/60 text-sm">Potential</p>
                      <p className={`text-lg font-semibold ${getPotentialColor(selectedGem.potential)}`}>
                        {selectedGem.potential.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 text-sm">Risk</p>
                      <p className={`text-lg font-semibold ${getRiskColor(selectedGem.riskLevel)}`}>
                        {selectedGem.riskLevel.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm">Price</p>
                    <p className="text-lg font-semibold text-white">${selectedGem.currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm">Market Cap</p>
                    <p className="text-lg font-semibold text-white">${selectedGem.marketCap.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm">24h Volume</p>
                    <p className="text-lg font-semibold text-white">${selectedGem.volume24h.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm">24h Change</p>
                    <p className={`text-lg font-semibold ${
                      selectedGem.priceChange24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                    }`}>
                      {selectedGem.priceChange24h >= 0 ? '+' : ''}{selectedGem.priceChange24h.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Signals and Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Positive Signals</h3>
                    <div className="space-y-2">
                      {selectedGem.signals.map((signal, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-crypto-green/10 rounded">
                          <TrendingUp className="w-4 h-4 text-crypto-green" />
                          <span className="text-white text-sm">{signal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Alerts</h3>
                    <div className="space-y-2">
                      {selectedGem.alerts.map((alert, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-crypto-yellow/10 rounded">
                          <Target className="w-4 h-4 text-crypto-yellow" />
                          <span className="text-white text-sm">{alert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">AI Analysis</h3>
                <AIInsights symbol={selectedGem.symbol} />
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* On-chain Metrics */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">On-chain Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Active Addresses</span>
                      <span className="text-white">{selectedGem.onChainMetrics.activeAddresses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Transactions</span>
                      <span className="text-white">{selectedGem.onChainMetrics.transactionCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Network Growth</span>
                      <span className={`${selectedGem.onChainMetrics.networkGrowth >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                        {selectedGem.onChainMetrics.networkGrowth >= 0 ? '+' : ''}{selectedGem.onChainMetrics.networkGrowth.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Developer Activity</span>
                      <span className="text-white">{selectedGem.onChainMetrics.developerActivity}</span>
                    </div>
                  </div>
                </div>

                {/* Social Metrics */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Social Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Twitter Followers</span>
                      <span className="text-white">{selectedGem.socialMetrics.twitterFollowers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Telegram Members</span>
                      <span className="text-white">{selectedGem.socialMetrics.telegramMembers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Reddit Subscribers</span>
                      <span className="text-white">{selectedGem.socialMetrics.redditSubscribers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Sentiment</span>
                      <span className={`${selectedGem.socialMetrics.sentiment >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                        {selectedGem.socialMetrics.sentiment >= 0 ? '+' : ''}{selectedGem.socialMetrics.sentiment.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GemHunter; 