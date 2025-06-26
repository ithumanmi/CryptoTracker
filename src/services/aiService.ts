import { AIInsight, MarketSentiment, OnChainData } from '../types/crypto';

// Mock AI service - trong thực tế sẽ tích hợp với AI models
class AIService {
  private sentimentCache: Map<string, MarketSentiment> = new Map();
  private insightsCache: Map<string, AIInsight[]> = new Map();

  // Sentiment Analysis
  async analyzeSentiment(text: string): Promise<number> {
    // Mock sentiment analysis
    const words = text.toLowerCase().split(' ');
    const positiveWords = ['bullish', 'moon', 'pump', 'buy', 'strong', 'growth', 'positive'];
    const negativeWords = ['bearish', 'dump', 'sell', 'weak', 'crash', 'negative', 'fear'];
    
    let score = 0;
    positiveWords.forEach(word => {
      if (words.includes(word)) score += 0.1;
    });
    negativeWords.forEach(word => {
      if (words.includes(word)) score -= 0.1;
    });
    
    return Math.max(-1, Math.min(1, score));
  }

  // Market Sentiment Analysis
  async getMarketSentiment(symbol: string): Promise<MarketSentiment> {
    const cacheKey = `${symbol}_${Math.floor(Date.now() / 300000)}`; // Cache for 5 minutes
    
    if (this.sentimentCache.has(cacheKey)) {
      return this.sentimentCache.get(cacheKey)!;
    }

    // Mock sentiment data
    const sentiment: MarketSentiment = {
      overall: Math.random() * 200 - 100, // -100 to 100
      social: Math.random() * 200 - 100,
      news: Math.random() * 200 - 100,
      technical: Math.random() * 200 - 100,
      onChain: Math.random() * 200 - 100,
      timestamp: Date.now()
    };

    this.sentimentCache.set(cacheKey, sentiment);
    return sentiment;
  }

  // Price Prediction using simple ML-like approach
  async predictPrice(symbol: string, timeframe: 'short_term' | 'medium_term' | 'long_term'): Promise<AIInsight> {
    const currentPrice = 50000; // Mock current price
    const volatility = 0.1; // 10% volatility
    
    // Simple prediction based on historical patterns and sentiment
    const sentiment = await this.getMarketSentiment(symbol);
    const sentimentFactor = sentiment.overall / 100; // -1 to 1
    
    let predictionChange: number;
    let confidence: number;
    
    switch (timeframe) {
      case 'short_term':
        predictionChange = sentimentFactor * volatility * 0.5; // 5% max change
        confidence = 0.6 + Math.abs(sentimentFactor) * 0.3; // 60-90% confidence
        break;
      case 'medium_term':
        predictionChange = sentimentFactor * volatility * 1.5; // 15% max change
        confidence = 0.5 + Math.abs(sentimentFactor) * 0.4; // 50-90% confidence
        break;
      case 'long_term':
        predictionChange = sentimentFactor * volatility * 3; // 30% max change
        confidence = 0.4 + Math.abs(sentimentFactor) * 0.5; // 40-90% confidence
        break;
    }

    const predictedPrice = currentPrice * (1 + predictionChange);
    const direction = predictionChange > 0 ? 'upward' : 'downward';
    
    const insight: AIInsight = {
      id: `prediction_${symbol}_${Date.now()}`,
      symbol,
      type: 'price_prediction',
      confidence: Math.min(confidence, 0.95),
      prediction: `${symbol} is predicted to move ${direction} by ${Math.abs(predictionChange * 100).toFixed(1)}% in the ${timeframe.replace('_', ' ')}`,
      reasoning: `Based on sentiment analysis (${sentiment.overall.toFixed(1)}), technical indicators, and market patterns`,
      timeframe,
      createdAt: Date.now()
    };

    return insight;
  }

  // Risk Assessment
  async assessRisk(symbol: string): Promise<AIInsight> {
    const riskFactors = [
      'volatility',
      'liquidity',
      'market_cap',
      'social_sentiment',
      'technical_indicators'
    ];

    const riskScores = riskFactors.map(() => Math.random());
    const averageRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
    
    let riskLevel: string;
    let confidence: number;
    
    if (averageRisk < 0.3) {
      riskLevel = 'LOW';
      confidence = 0.8;
    } else if (averageRisk < 0.7) {
      riskLevel = 'MEDIUM';
      confidence = 0.7;
    } else {
      riskLevel = 'HIGH';
      confidence = 0.75;
    }

    const insight: AIInsight = {
      id: `risk_${symbol}_${Date.now()}`,
      symbol,
      type: 'risk_assessment',
      confidence,
      prediction: `${symbol} has ${riskLevel.toLowerCase()} risk level`,
      reasoning: `Risk assessment based on volatility (${(riskScores[0] * 100).toFixed(1)}%), liquidity (${(riskScores[1] * 100).toFixed(1)}%), and market conditions`,
      timeframe: 'short_term',
      createdAt: Date.now()
    };

    return insight;
  }

  // Opportunity Detection
  async detectOpportunities(symbol: string): Promise<AIInsight[]> {
    const opportunities: AIInsight[] = [];
    
    // Check for various opportunity types
    const opportunityTypes = [
      'oversold_condition',
      'breakout_potential',
      'accumulation_phase',
      'institutional_interest'
    ];

    opportunityTypes.forEach(type => {
      const probability = Math.random();
      if (probability > 0.7) { // Only show high-probability opportunities
        const insight: AIInsight = {
          id: `opportunity_${symbol}_${type}_${Date.now()}`,
          symbol,
          type: 'opportunity_detection',
          confidence: probability,
          prediction: `Detected ${type.replace('_', ' ')} opportunity for ${symbol}`,
          reasoning: `AI analysis indicates potential ${type.replace('_', ' ')} based on market patterns and indicators`,
          timeframe: 'short_term',
          createdAt: Date.now()
        };
        opportunities.push(insight);
      }
    });

    return opportunities;
  }

  // On-chain Analysis
  async analyzeOnChainData(symbol: string): Promise<OnChainData> {
    // Mock on-chain data
    const onChainData: OnChainData = {
      symbol,
      activeAddresses: Math.floor(Math.random() * 1000000) + 100000,
      transactionCount: Math.floor(Math.random() * 100000) + 10000,
      largeTransactions: Math.floor(Math.random() * 1000) + 100,
      whaleMovements: Math.floor(Math.random() * 100) + 10,
      exchangeFlows: {
        inflow: Math.random() * 1000000,
        outflow: Math.random() * 1000000,
        netFlow: (Math.random() - 0.5) * 2000000
      },
      timestamp: Date.now()
    };

    return onChainData;
  }

  // Generate comprehensive AI insights
  async generateInsights(symbol: string): Promise<AIInsight[]> {
    const cacheKey = `${symbol}_${Math.floor(Date.now() / 600000)}`; // Cache for 10 minutes
    
    if (this.insightsCache.has(cacheKey)) {
      return this.insightsCache.get(cacheKey)!;
    }

    const insights: AIInsight[] = [];

    // Price prediction
    const pricePrediction = await this.predictPrice(symbol, 'short_term');
    insights.push(pricePrediction);

    // Risk assessment
    const riskAssessment = await this.assessRisk(symbol);
    insights.push(riskAssessment);

    // Opportunity detection
    const opportunities = await this.detectOpportunities(symbol);
    insights.push(...opportunities);

    // Sentiment analysis
    const sentiment = await this.getMarketSentiment(symbol);
    const sentimentInsight: AIInsight = {
      id: `sentiment_${symbol}_${Date.now()}`,
      symbol,
      type: 'sentiment_analysis',
      confidence: 0.8,
      prediction: `Market sentiment for ${symbol} is ${sentiment.overall > 0 ? 'positive' : 'negative'} (${sentiment.overall.toFixed(1)})`,
      reasoning: `Based on social media analysis, news sentiment, and technical indicators`,
      timeframe: 'short_term',
      createdAt: Date.now()
    };
    insights.push(sentimentInsight);

    this.insightsCache.set(cacheKey, insights);
    return insights;
  }

  // Pattern Recognition
  async recognizePatterns(symbol: string, priceData: number[]): Promise<string[]> {
    const patterns: string[] = [];
    
    // Simple pattern recognition
    if (priceData.length >= 5) {
      const recent = priceData.slice(-5);
      const trend = recent[recent.length - 1] - recent[0];
      const volatility = calculateStandardDeviation(recent);
      
      if (trend > 0 && volatility < 0.05) {
        patterns.push('Uptrend with low volatility');
      } else if (trend < 0 && volatility > 0.1) {
        patterns.push('Downtrend with high volatility');
      } else if (Math.abs(trend) < 0.02) {
        patterns.push('Sideways consolidation');
      }
      
      // Check for double top/bottom
      if (recent[1] === Math.max(...recent) && recent[3] === Math.max(...recent)) {
        patterns.push('Potential double top formation');
      } else if (recent[1] === Math.min(...recent) && recent[3] === Math.min(...recent)) {
        patterns.push('Potential double bottom formation');
      }
    }
    
    return patterns;
  }

  // News Impact Analysis
  async analyzeNewsImpact(newsItems: string[]): Promise<{ impact: number; keywords: string[] }> {
    const keywords = ['partnership', 'adoption', 'regulation', 'hack', 'launch', 'upgrade'];
    const foundKeywords: string[] = [];
    let totalSentiment = 0;
    
    for (const news of newsItems) {
      const sentiment = await this.analyzeSentiment(news);
      totalSentiment += sentiment;
      
      keywords.forEach(keyword => {
        if (news.toLowerCase().includes(keyword)) {
          foundKeywords.push(keyword);
        }
      });
    }
    
    const averageSentiment = totalSentiment / newsItems.length;
    const uniqueKeywords = Array.from(new Set(foundKeywords));
    
    return {
      impact: averageSentiment,
      keywords: uniqueKeywords
    };
  }

  async getInsights(symbol: string): Promise<AIInsight> {
    // Mock AI insights
    const insights = [
      {
        id: '1',
        symbol,
        type: 'price_prediction' as const,
        confidence: 0.75,
        prediction: 'Bullish momentum expected in next 24-48 hours',
        reasoning: 'Strong technical indicators and positive social sentiment',
        timeframe: 'short_term' as const,
        createdAt: Date.now(),
        accuracy: 0.82
      },
      {
        id: '2',
        symbol,
        type: 'risk_assessment' as const,
        confidence: 0.68,
        prediction: 'Medium risk with potential upside',
        reasoning: 'Volatility within normal range, good liquidity',
        timeframe: 'medium_term' as const,
        createdAt: Date.now(),
        accuracy: 0.71
      }
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }
}

// Helper function for standard deviation
function calculateStandardDeviation(array: number[]): number {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

// Singleton instance
export const aiService = new AIService();
export default aiService; 