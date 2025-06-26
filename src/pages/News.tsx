import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { NewsItem } from '../types/crypto';
import { cryptoApi } from '../services/cryptoApi';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await cryptoApi.getCryptoNews();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'positive') return item.sentiment === 'POSITIVE';
    if (filter === 'negative') return item.sentiment === 'NEGATIVE';
    return true;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return 'text-crypto-green';
      case 'NEGATIVE': return 'text-crypto-red';
      case 'NEUTRAL': return 'text-white/60';
      default: return 'text-white/60';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return <TrendingUp className="w-4 h-4" />;
      case 'NEGATIVE': return <TrendingDown className="w-4 h-4" />;
      case 'NEUTRAL': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h1 className="text-3xl font-bold text-white">Tin Tức Crypto</h1>
          <p className="text-white/60">Cập nhật tin tức mới nhất về thị trường crypto</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-500"
          >
            <option value="all">Tất cả</option>
            <option value="positive">Tích cực</option>
            <option value="negative">Tiêu cực</option>
          </select>
        </div>
      </div>

      {/* Featured News */}
      {filteredNews.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Newspaper className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-white">Tin Nổi Bật</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNews.slice(0, 2).map((item) => (
              <div key={item.id} className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${getSentimentColor(item.sentiment)} bg-white/10`}>
                      {getSentimentIcon(item.sentiment)}
                    </div>
                    <span className="text-sm text-white/60">{item.source}</span>
                  </div>
                  <span className="text-sm text-white/60">{formatDate(item.publishedAt)}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-white/80 mb-4 line-clamp-3">{item.summary}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary-500 hover:text-primary-400 text-sm"
                  >
                    <span>Đọc thêm</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All News */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-6">Tất Cả Tin Tức</h2>
        
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <div key={item.id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${getSentimentColor(item.sentiment)} bg-white/10`}>
                    {getSentimentIcon(item.sentiment)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-white/60">{item.source}</span>
                      <span className="text-sm text-white/60">{formatDate(item.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-400"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              
              <p className="text-white/80 mb-3">{item.summary}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={`flex items-center space-x-1 text-sm ${getSentimentColor(item.sentiment)}`}>
                  {getSentimentIcon(item.sentiment)}
                  <span className="capitalize">{item.sentiment.toLowerCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Sentiment */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-6">Tâm Lý Thị Trường</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-crypto-green/20 rounded-full mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-crypto-green" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Tin Tích Cực</h3>
            <p className="text-2xl font-bold text-crypto-green mb-1">
              {news.filter(item => item.sentiment === 'POSITIVE').length}
            </p>
            <p className="text-sm text-white/60">Tin tức tốt</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-crypto-red/20 rounded-full mx-auto mb-4">
              <TrendingDown className="w-8 h-8 text-crypto-red" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Tin Tiêu Cực</h3>
            <p className="text-2xl font-bold text-crypto-red mb-1">
              {news.filter(item => item.sentiment === 'NEGATIVE').length}
            </p>
            <p className="text-sm text-white/60">Tin tức xấu</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
              <Clock className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Tin Trung Lập</h3>
            <p className="text-2xl font-bold text-white/60 mb-1">
              {news.filter(item => item.sentiment === 'NEUTRAL').length}
            </p>
            <p className="text-sm text-white/60">Tin tức trung tính</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News; 