export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: Roi | null;
  last_updated: string;
}

export interface Roi {
  times: number;
  currency: string;
  percentage: number;
}

export interface MarketData {
  total_market_cap: number;
  total_volume: number;
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
}

export interface GemAnalysis {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  score: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  potential: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  description: string;
  tokenomics: Tokenomics;
  socialMetrics: SocialMetrics;
}

export interface GemData {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  potential: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  onChainMetrics: {
    activeAddresses: number;
    transactionCount: number;
    networkGrowth: number;
    developerActivity: number;
  };
  socialMetrics: {
    twitterFollowers: number;
    telegramMembers: number;
    redditSubscribers: number;
    sentiment: number;
  };
  defiMetrics: {
    tvl: number;
    apy: number;
    liquidity: number;
    protocolCount: number;
  };
  nftMetrics: {
    floorPrice: number;
    volume24h: number;
    uniqueHolders: number;
    collectionCount: number;
  };
  signals: string[];
  alerts: string[];
}

export interface Tokenomics {
  totalSupply: number;
  circulatingSupply: number;
  burnedTokens: number;
  lockedTokens: number;
  teamAllocation: number;
  marketingAllocation: number;
  liquidityAllocation: number;
}

export interface SocialMetrics {
  twitterFollowers: number;
  telegramMembers: number;
  discordMembers: number;
  redditSubscribers: number;
  githubStars: number;
  socialScore: number;
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  tags: string[];
}

// Real-time Data Types
export interface RealTimePrice {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  timestamp: number;
}

export interface WebSocketMessage {
  type: 'price_update' | 'market_update' | 'news_update' | 'alert';
  data: any;
  timestamp: number;
}

// Advanced Technical Analysis Types
export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  movingAverages: {
    sma20: number;
    sma50: number;
    sma200: number;
    ema12: number;
    ema26: number;
  };
  supportResistance: {
    support: number[];
    resistance: number[];
  };
  fibonacci: {
    retracements: number[];
    extensions: number[];
  };
  stochastic: {
    k: number;
    d: number;
  };
  williamsR: number;
  signals: string[];
  supportLevels: number[];
  resistanceLevels: number[];
}

export interface PriceAlert {
  id: string;
  symbol: string;
  type: 'above' | 'below';
  price: number;
  active: boolean;
  createdAt: number;
  triggeredAt?: number;
  notificationType: 'email' | 'push' | 'both';
  description?: string;
  userId?: string;
}

export interface AlertHistory {
  id: string;
  alertId: string;
  symbol: string;
  triggeredPrice: number;
  targetPrice: number;
  triggeredAt: number;
  message: string;
}

export interface AlertSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  telegramNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
}

// AI-Powered Insights Types
export interface AIInsight {
  id: string;
  symbol: string;
  type: 'price_prediction' | 'sentiment_analysis' | 'risk_assessment' | 'opportunity_detection';
  confidence: number;
  prediction: string;
  reasoning: string;
  timeframe: 'short_term' | 'medium_term' | 'long_term';
  createdAt: number;
  accuracy?: number;
}

export interface MarketSentiment {
  overall: number; // -100 to 100
  social: number;
  news: number;
  technical: number;
  onChain: number;
  timestamp: number;
}

export interface OnChainData {
  symbol: string;
  activeAddresses: number;
  transactionCount: number;
  largeTransactions: number;
  whaleMovements: number;
  exchangeFlows: {
    inflow: number;
    outflow: number;
    netFlow: number;
  };
  timestamp: number;
}

// Advanced Portfolio Types
export interface PortfolioAnalytics {
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  bestPerformer: PortfolioItem;
  worstPerformer: PortfolioItem;
  riskMetrics: {
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
    beta: number;
  };
  allocation: {
    byAsset: { [symbol: string]: number };
    byCategory: { [category: string]: number };
  };
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

// DeFi and NFT Types
export interface DeFiProtocol {
  id: string;
  name: string;
  category: 'DEX' | 'Lending' | 'Yield' | 'Derivatives';
  tvl: number;
  volume24h: number;
  apy: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  tokens: string[];
}

export interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  floorPrice: number;
  volume24h: number;
  holders: number;
  items: number;
  blockchain: string;
  category: string;
}

// Social Trading Types
export interface SocialSignal {
  id: string;
  trader: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  timestamp: number;
  followers: number;
  successRate: number;
}

export interface TradingBot {
  id: string;
  name: string;
  strategy: string;
  performance: {
    totalReturn: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED';
  symbols: string[];
  createdAt: number;
} 