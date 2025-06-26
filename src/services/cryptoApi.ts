import axios from 'axios';
import { CryptoCurrency, MarketData, GemAnalysis, NewsItem, CandlestickData } from '../types/crypto';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Mock data cho development
const mockGems: GemAnalysis[] = [
  {
    id: '1',
    name: 'Pepe',
    symbol: 'PEPE',
    price: 0.00000123,
    marketCap: 50000000,
    volume24h: 2500000,
    priceChange24h: 15.5,
    score: 85,
    risk: 'MEDIUM',
    potential: 'HIGH',
    category: 'Meme Coin',
    description: 'Pepe the Frog meme coin với cộng đồng mạnh mẽ',
    tokenomics: {
      totalSupply: 420690000000000,
      circulatingSupply: 420690000000000,
      burnedTokens: 0,
      lockedTokens: 0,
      teamAllocation: 0,
      marketingAllocation: 0,
      liquidityAllocation: 100
    },
    socialMetrics: {
      twitterFollowers: 500000,
      telegramMembers: 100000,
      discordMembers: 50000,
      redditSubscribers: 25000,
      githubStars: 0,
      socialScore: 85
    }
  },
  {
    id: '2',
    name: 'Shiba Inu',
    symbol: 'SHIB',
    price: 0.00001234,
    marketCap: 7500000000,
    volume24h: 150000000,
    priceChange24h: -2.3,
    score: 78,
    risk: 'LOW',
    potential: 'MEDIUM',
    category: 'Meme Coin',
    description: 'Dogecoin killer với hệ sinh thái phát triển',
    tokenomics: {
      totalSupply: 1000000000000000,
      circulatingSupply: 549000000000000,
      burnedTokens: 410000000000000,
      lockedTokens: 0,
      teamAllocation: 0,
      marketingAllocation: 0,
      liquidityAllocation: 100
    },
    socialMetrics: {
      twitterFollowers: 3500000,
      telegramMembers: 500000,
      discordMembers: 200000,
      redditSubscribers: 100000,
      githubStars: 0,
      socialScore: 92
    }
  }
];

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Bitcoin vượt mốc $50,000 - Thị trường crypto sôi động',
    summary: 'Bitcoin đã vượt qua mốc $50,000 lần đầu tiên trong năm 2024, tạo động lực cho toàn bộ thị trường crypto.',
    url: 'https://example.com/bitcoin-50000',
    publishedAt: '2024-01-15T10:30:00Z',
    source: 'CryptoNews',
    sentiment: 'POSITIVE',
    tags: ['Bitcoin', 'Market Analysis', 'Price Action']
  },
  {
    id: '2',
    title: 'Ethereum Layer 2 giải pháp tăng trưởng mạnh',
    summary: 'Các giải pháp Layer 2 trên Ethereum như Arbitrum và Optimism đang thu hút nhiều người dùng và TVL.',
    url: 'https://example.com/ethereum-layer2',
    publishedAt: '2024-01-15T09:15:00Z',
    source: 'DeFi Pulse',
    sentiment: 'POSITIVE',
    tags: ['Ethereum', 'Layer 2', 'DeFi']
  }
];

export const cryptoApi = {
  // Lấy top 100 coin theo market cap
  async getTopCoins(limit: number = 100): Promise<CryptoCurrency[]> {
    try {
      const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          locale: 'en'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top coins:', error);
      return [];
    }
  },

  // Lấy thông tin chi tiết của một coin
  async getCoinDetails(id: string): Promise<CryptoCurrency | null> {
    try {
      const response = await axios.get(
        `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching coin details:', error);
      return null;
    }
  },

  // Lấy dữ liệu thị trường tổng thể
  async getGlobalMarketData(): Promise<MarketData | null> {
    try {
      const response = await axios.get(`${COINGECKO_API}/global`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global market data:', error);
      return null;
    }
  },

  // Lấy danh sách gem tiềm năng (mock data)
  async getGemAnalysis(): Promise<GemAnalysis[]> {
    // Trong thực tế, đây sẽ là API call đến service phân tích
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGems), 1000);
    });
  },

  // Lấy tin tức crypto (mock data)
  async getCryptoNews(): Promise<NewsItem[]> {
    // Trong thực tế, đây sẽ là API call đến service tin tức
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockNews), 1000);
    });
  },

  // Tìm kiếm coin
  async searchCoins(query: string): Promise<CryptoCurrency[]> {
    try {
      const response = await axios.get(
        `${COINGECKO_API}/search?query=${encodeURIComponent(query)}`
      );
      return response.data.coins.slice(0, 10);
    } catch (error) {
      console.error('Error searching coins:', error);
      return [];
    }
  },

  async getAllCoins(): Promise<CryptoCurrency[]> {
    try {
      const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 250,
          page: 1,
          sparkline: false,
          locale: 'en'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all coins:', error);
      return [];
    }
  },

  async getCandlestickData(symbol: string, timeframe: string): Promise<CandlestickData[]> {
    try {
      // Convert timeframe to days
      const days = timeframe === '1D' ? 1 : 
                   timeframe === '1W' ? 7 : 
                   timeframe === '1M' ? 30 : 
                   timeframe === '3M' ? 90 : 30;
      
      const response = await axios.get(`${COINGECKO_API}/coins/${symbol}/ohlc`, {
        params: {
          vs_currency: 'usd',
          days: days
        }
      });
      
      return response.data.map((candle: number[]) => ({
        time: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: 0 // CoinGecko doesn't provide volume in OHLC endpoint
      }));
    } catch (error) {
      console.error('Error fetching candlestick data:', error);
      // Return mock data if API fails
      return this.generateMockCandlestickData();
    }
  },

  generateMockCandlestickData(): CandlestickData[] {
    const data: CandlestickData[] = [];
    const basePrice = 50000;
    let currentPrice = basePrice;
    
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.5) * 0.1; // ±5% change
      currentPrice *= (1 + change);
      
      const high = currentPrice * (1 + Math.random() * 0.02);
      const low = currentPrice * (1 - Math.random() * 0.02);
      const open = currentPrice * (1 + (Math.random() - 0.5) * 0.01);
      const close = currentPrice;
      
      data.push({
        time: Date.now() - (100 - i) * 24 * 60 * 60 * 1000, // Daily intervals
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000 + 100000
      });
    }
    
    return data;
  }
}; 