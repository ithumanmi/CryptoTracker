import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { PortfolioItem } from '../types/crypto';

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    {
      id: '1',
      symbol: 'BTC',
      name: 'Bitcoin',
      quantity: 0.5,
      buyPrice: 45000,
      currentPrice: 50000,
      totalValue: 25000,
      profitLoss: 2500,
      profitLossPercentage: 11.11
    },
    {
      id: '2',
      symbol: 'ETH',
      name: 'Ethereum',
      quantity: 2.5,
      buyPrice: 2800,
      currentPrice: 3200,
      totalValue: 8000,
      profitLoss: 1000,
      profitLossPercentage: 14.29
    },
    {
      id: '3',
      symbol: 'ADA',
      name: 'Cardano',
      quantity: 1000,
      buyPrice: 0.45,
      currentPrice: 0.42,
      totalValue: 420,
      profitLoss: -30,
      profitLossPercentage: -6.67
    }
  ]);

  const totalValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0);
  const totalProfitLoss = portfolio.reduce((sum, item) => sum + item.profitLoss, 0);
  const totalProfitLossPercentage = (totalProfitLoss / (totalValue - totalProfitLoss)) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-white/60">Quản lý danh mục đầu tư</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Coin
        </button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Tổng Giá Trị</p>
              <p className="text-2xl font-bold text-white">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Lãi/Lỗ</p>
              <p className={`text-2xl font-bold ${
                totalProfitLoss >= 0 ? 'text-crypto-green' : 'text-crypto-red'
              }`}>
                ${totalProfitLoss.toLocaleString()}
              </p>
            </div>
            {totalProfitLoss >= 0 ? (
              <TrendingUp className="w-8 h-8 text-crypto-green" />
            ) : (
              <TrendingDown className="w-8 h-8 text-crypto-red" />
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">% Thay Đổi</p>
              <p className={`text-2xl font-bold ${
                totalProfitLossPercentage >= 0 ? 'text-crypto-green' : 'text-crypto-red'
              }`}>
                {totalProfitLossPercentage >= 0 ? '+' : ''}{totalProfitLossPercentage.toFixed(2)}%
              </p>
            </div>
            <PieChart className="w-8 h-8 text-crypto-yellow" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Số Coin</p>
              <p className="text-2xl font-bold text-white">{portfolio.length}</p>
            </div>
            <div className="w-8 h-8 bg-crypto-purple/20 rounded-lg flex items-center justify-center">
              <span className="text-crypto-purple font-bold">{portfolio.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-6">Danh Mục Chi Tiết</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/60 font-medium">Coin</th>
                <th className="text-right py-3 px-4 text-white/60 font-medium">Số Lượng</th>
                <th className="text-right py-3 px-4 text-white/60 font-medium">Giá Mua</th>
                <th className="text-right py-3 px-4 text-white/60 font-medium">Giá Hiện Tại</th>
                <th className="text-right py-3 px-4 text-white/60 font-medium">Tổng Giá Trị</th>
                <th className="text-right py-3 px-4 text-white/60 font-medium">Lãi/Lỗ</th>
                <th className="text-right py-3 px-4 text-white/60 font-medium">% Thay Đổi</th>
                <th className="text-right py-3 px-4 text-white/60 font-medium">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                        <span className="text-primary-500 font-bold text-sm">{item.symbol}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-white/60">{item.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="font-mono text-white">{item.quantity}</p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="font-mono text-white">${item.buyPrice.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="font-mono text-white">${item.currentPrice.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="font-mono text-white">${item.totalValue.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className={`font-mono font-semibold ${
                      item.profitLoss >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                    }`}>
                      ${item.profitLoss.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className={`flex items-center justify-end space-x-1 ${
                      item.profitLossPercentage >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                    }`}>
                      {item.profitLossPercentage >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-semibold">
                        {item.profitLossPercentage >= 0 ? '+' : ''}{item.profitLossPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-primary-500 hover:text-primary-400 text-sm">
                        Sửa
                      </button>
                      <button className="text-crypto-red hover:text-red-400 text-sm">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Phân Bổ Danh Mục</h3>
          <div className="space-y-4">
            {portfolio.map((item) => {
              const allocation = (item.totalValue / totalValue) * 100;
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{item.symbol}</span>
                    <span className="text-white/60">{allocation.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${allocation}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Thống Kê</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/60">Coin có lãi</span>
              <span className="text-crypto-green font-medium">
                {portfolio.filter(item => item.profitLoss > 0).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/60">Coin có lỗ</span>
              <span className="text-crypto-red font-medium">
                {portfolio.filter(item => item.profitLoss < 0).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/60">Coin có lãi cao nhất</span>
              <span className="text-crypto-green font-medium">
                {portfolio.reduce((max, item) => 
                  item.profitLossPercentage > max.profitLossPercentage ? item : max
                ).symbol}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/60">Coin có lỗ cao nhất</span>
              <span className="text-crypto-red font-medium">
                {portfolio.reduce((min, item) => 
                  item.profitLossPercentage < min.profitLossPercentage ? item : min
                ).symbol}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio; 