import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Target, Zap } from 'lucide-react';
import { AIInsight, MarketSentiment } from '../types/crypto';
import { aiService } from '../services/aiService';

interface AIInsightsProps {
  symbol: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ symbol }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'short_term' | 'medium_term' | 'long_term'>('short_term');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [aiInsights, marketSentiment] = await Promise.all([
          aiService.generateInsights(symbol),
          aiService.getMarketSentiment(symbol)
        ]);
        
        setInsights(aiInsights);
        setSentiment(marketSentiment);
      } catch (error) {
        console.error('Error fetching AI insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [symbol]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'price_prediction':
        return <TrendingUp className="w-5 h-5" />;
      case 'risk_assessment':
        return <AlertTriangle className="w-5 h-5" />;
      case 'opportunity_detection':
        return <Target className="w-5 h-5" />;
      case 'sentiment_analysis':
        return <Brain className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'price_prediction':
        return 'text-crypto-green';
      case 'risk_assessment':
        return 'text-crypto-red';
      case 'opportunity_detection':
        return 'text-crypto-yellow';
      case 'sentiment_analysis':
        return 'text-primary-500';
      default:
        return 'text-white';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-crypto-green';
    if (confidence >= 0.6) return 'text-crypto-yellow';
    return 'text-crypto-red';
  };

  const getSentimentColor = (value: number) => {
    if (value > 50) return 'text-crypto-green';
    if (value < -50) return 'text-crypto-red';
    return 'text-crypto-yellow';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-white">AI Insights</h2>
          </div>
          <div className="flex items-center space-x-2">
            {(['short_term', 'medium_term', 'long_term'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                }`}
              >
                {timeframe.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Market Sentiment Overview */}
        {sentiment && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Market Sentiment</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-white/60 text-sm">Overall</p>
                <p className={`text-xl font-bold ${getSentimentColor(sentiment.overall)}`}>
                  {sentiment.overall.toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm">Social</p>
                <p className={`text-xl font-bold ${getSentimentColor(sentiment.social)}`}>
                  {sentiment.social.toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm">News</p>
                <p className={`text-xl font-bold ${getSentimentColor(sentiment.news)}`}>
                  {sentiment.news.toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm">Technical</p>
                <p className={`text-xl font-bold ${getSentimentColor(sentiment.technical)}`}>
                  {sentiment.technical.toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm">On-Chain</p>
                <p className={`text-xl font-bold ${getSentimentColor(sentiment.onChain)}`}>
                  {sentiment.onChain.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights List */}
        <div className="space-y-4">
          {insights
            .filter(insight => insight.timeframe === selectedTimeframe)
            .map((insight) => (
              <div key={insight.id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-white/10 ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white capitalize">
                        {insight.type.replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-white/60">
                        {insight.timeframe.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getConfidenceColor(insight.confidence)}`}>
                      {(insight.confidence * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-white/60">Confidence</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-white font-medium">{insight.prediction}</p>
                  <p className="text-sm text-white/60">{insight.reasoning}</p>
                </div>

                {insight.accuracy && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Historical Accuracy</span>
                      <span className="text-crypto-green font-medium">
                        {(insight.accuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-crypto-yellow" />
          <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Trading Strategy</h4>
            <p className="text-sm text-white/60 mb-3">
              Based on current market conditions and AI analysis
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Action</span>
                <span className="text-crypto-green font-medium">HOLD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Target Price</span>
                <span className="text-white font-medium">$52,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Stop Loss</span>
                <span className="text-white font-medium">$47,500</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Risk Assessment</h4>
            <p className="text-sm text-white/60 mb-3">
              Current risk level and mitigation strategies
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Risk Level</span>
                <span className="text-crypto-yellow font-medium">MEDIUM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Volatility</span>
                <span className="text-white font-medium">12.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Liquidity</span>
                <span className="text-crypto-green font-medium">HIGH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Recognition */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-crypto-purple" />
          <h3 className="text-lg font-semibold text-white">Pattern Recognition</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="w-12 h-12 bg-crypto-green/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-crypto-green" />
            </div>
            <p className="font-semibold text-white">Uptrend</p>
            <p className="text-sm text-white/60">Detected</p>
          </div>

          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="w-12 h-12 bg-crypto-yellow/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-crypto-yellow" />
            </div>
            <p className="font-semibold text-white">Support</p>
            <p className="text-sm text-white/60">$48,000</p>
          </div>

          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="w-12 h-12 bg-crypto-red/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-crypto-red" />
            </div>
            <p className="font-semibold text-white">Resistance</p>
            <p className="text-sm text-white/60">$52,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights; 