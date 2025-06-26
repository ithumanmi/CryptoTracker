import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { CandlestickData } from '../types/crypto';

interface AdvancedChartProps {
  data: CandlestickData[];
  symbol: string;
  height?: number;
  showVolume?: boolean;
  showIndicators?: boolean;
}

const AdvancedChart: React.FC<AdvancedChartProps> = ({
  data,
  symbol,
  height = 400,
  showVolume = true,
  showIndicators = true
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#ffffff',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#758696',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#758696',
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
        textColor: '#ffffff',
      },
      timeScale: {
        borderColor: '#2B2B43',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Add volume series if enabled
    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });

      volumeSeriesRef.current = volumeSeries;
    }

    // Set data - convert time to timestamp format
    const chartData = data.map(d => ({
      time: Math.floor(d.time / 1000) as any, // Convert to Unix timestamp
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candlestickSeries.setData(chartData);

    if (showVolume && volumeSeriesRef.current) {
      const volumeData = data.map(d => ({
        time: Math.floor(d.time / 1000) as any, // Convert to Unix timestamp
        value: d.volume,
        color: d.close > d.open ? '#26a69a' : '#ef5350',
      }));
      volumeSeriesRef.current.setData(volumeData);
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, height, showVolume]);

  // Add technical indicators
  useEffect(() => {
    if (!showIndicators || !chartRef.current || !candlestickSeriesRef.current) return;

    const chart = chartRef.current;
    const candlestickSeries = candlestickSeriesRef.current;

    // Calculate moving averages
    const closes = data.map(d => d.close);
    const sma20 = calculateSMA(closes, 20);
    const sma50 = calculateSMA(closes, 50);

    // Add SMA 20
    const sma20Series = chart.addLineSeries({
      color: '#2196F3',
      lineWidth: 2,
      title: 'SMA 20',
    });

    const sma20Data = data.slice(19).map((d, i) => ({
      time: Math.floor(d.time / 1000) as any, // Convert to Unix timestamp
      value: sma20[i],
    }));
    sma20Series.setData(sma20Data);

    // Add SMA 50
    const sma50Series = chart.addLineSeries({
      color: '#FF9800',
      lineWidth: 2,
      title: 'SMA 50',
    });

    const sma50Data = data.slice(49).map((d, i) => ({
      time: Math.floor(d.time / 1000) as any, // Convert to Unix timestamp
      value: sma50[i],
    }));
    sma50Series.setData(sma50Data);

    // Add Bollinger Bands
    const bollingerBands = calculateBollingerBands(closes);
    
    const upperBandSeries = chart.addLineSeries({
      color: '#9C27B0',
      lineWidth: 1,
      title: 'BB Upper',
      lineStyle: 2,
    });

    const lowerBandSeries = chart.addLineSeries({
      color: '#9C27B0',
      lineWidth: 1,
      title: 'BB Lower',
      lineStyle: 2,
    });

    const upperData = data.slice(19).map((d, i) => ({
      time: Math.floor(d.time / 1000) as any, // Convert to Unix timestamp
      value: bollingerBands.upper[i],
    }));
    const lowerData = data.slice(19).map((d, i) => ({
      time: Math.floor(d.time / 1000) as any, // Convert to Unix timestamp
      value: bollingerBands.lower[i],
    }));

    upperBandSeries.setData(upperData);
    lowerBandSeries.setData(lowerData);

  }, [data, showIndicators]);

  const handleTimeframeChange = (newTimeframe: typeof timeframe) => {
    setTimeframe(newTimeframe);
    // In a real app, you would fetch new data based on timeframe
  };

  // Helper functions for technical indicators
  const calculateSMA = (data: number[], period: number): number[] => {
    const sma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  };

  const calculateBollingerBands = (data: number[], period: number = 20, stdDev: number = 2) => {
    const sma = calculateSMA(data, period);
    const upper: number[] = [];
    const lower: number[] = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = sma[i - period + 1];
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      upper.push(mean + (standardDeviation * stdDev));
      lower.push(mean - (standardDeviation * stdDev));
    }
    
    return { upper, lower };
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{symbol} Chart</h3>
        <div className="flex items-center space-x-2">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div ref={chartContainerRef} className="w-full" />
      
      <div className="mt-4 flex items-center justify-between text-sm text-white/60">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded"></div>
            <span>SMA 20</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-crypto-yellow rounded"></div>
            <span>SMA 50</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-crypto-purple rounded border border-dashed"></div>
            <span>Bollinger Bands</span>
          </div>
        </div>
        
        <div className="text-right">
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChart; 