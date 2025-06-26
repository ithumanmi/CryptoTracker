import { CandlestickData, TechnicalIndicators } from '../types/crypto';

// Simple Moving Average
export const calculateSMA = (data: number[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};

// Exponential Moving Average
export const calculateEMA = (data: number[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  const firstSMA = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema.push(firstSMA);
  
  for (let i = 1; i < data.length; i++) {
    const newEMA = (data[i] * multiplier) + (ema[i - 1] * (1 - multiplier));
    ema.push(newEMA);
  }
  
  return ema;
};

// Relative Strength Index (RSI)
export const calculateRSI = (data: number[], period: number = 14): number[] => {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate gains and losses
  for (let i = 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  // Calculate average gains and losses
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  // Calculate RSI
  for (let i = period; i < data.length; i++) {
    const rs = avgGain / avgLoss;
    const rsiValue = 100 - (100 / (1 + rs));
    rsi.push(rsiValue);
    
    // Update averages
    avgGain = ((avgGain * (period - 1)) + gains[i - 1]) / period;
    avgLoss = ((avgLoss * (period - 1)) + losses[i - 1]) / period;
  }
  
  return rsi;
};

// MACD (Moving Average Convergence Divergence)
export const calculateMACD = (data: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) => {
  const ema12 = calculateEMA(data, fastPeriod);
  const ema26 = calculateEMA(data, slowPeriod);
  
  // Calculate MACD line
  const macdLine: number[] = [];
  const startIndex = Math.max(fastPeriod, slowPeriod) - 1;
  
  for (let i = startIndex; i < data.length; i++) {
    const macdValue = ema12[i] - ema26[i];
    macdLine.push(macdValue);
  }
  
  // Calculate signal line
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  // Calculate histogram
  const histogram: number[] = [];
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + signalPeriod - 1] - signalLine[i]);
  }
  
  return {
    macd: macdLine,
    signal: signalLine,
    histogram: histogram
  };
};

// Bollinger Bands
export const calculateBollingerBands = (data: number[], period: number = 20, stdDev: number = 2) => {
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
  
  return {
    upper,
    middle: sma,
    lower
  };
};

// Support and Resistance Levels
export const findSupportResistance = (data: CandlestickData[], sensitivity: number = 0.02) => {
  const highs: number[] = [];
  const lows: number[] = [];
  
  // Find local highs and lows
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i].high > data[i - 1].high && data[i].high > data[i + 1].high) {
      highs.push(data[i].high);
    }
    if (data[i].low < data[i - 1].low && data[i].low < data[i + 1].low) {
      lows.push(data[i].low);
    }
  }
  
  // Group nearby levels
  const groupLevels = (levels: number[], threshold: number) => {
    const grouped: number[] = [];
    const sorted = levels.sort((a, b) => a - b);
    
    let currentGroup: number[] = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
      const diff = Math.abs(sorted[i] - currentGroup[currentGroup.length - 1]) / currentGroup[currentGroup.length - 1];
      
      if (diff <= threshold) {
        currentGroup.push(sorted[i]);
      } else {
        // Calculate average of current group
        const avg = currentGroup.reduce((a, b) => a + b, 0) / currentGroup.length;
        grouped.push(avg);
        currentGroup = [sorted[i]];
      }
    }
    
    if (currentGroup.length > 0) {
      const avg = currentGroup.reduce((a, b) => a + b, 0) / currentGroup.length;
      grouped.push(avg);
    }
    
    return grouped;
  };
  
  const resistance = groupLevels(highs, sensitivity);
  const support = groupLevels(lows, sensitivity);
  
  return { support, resistance };
};

// Fibonacci Retracements
export const calculateFibonacciRetracements = (high: number, low: number) => {
  const diff = high - low;
  const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  
  return levels.map(level => {
    if (level === 0) return low;
    if (level === 1) return high;
    return high - (diff * level);
  });
};

// Fibonacci Extensions
export const calculateFibonacciExtensions = (high: number, low: number, retracement: number) => {
  const diff = high - low;
  const levels = [0, 1.272, 1.618, 2.0, 2.618, 3.618];
  
  return levels.map(level => {
    if (level === 0) return retracement;
    return retracement + (diff * level);
  });
};

// Volume Weighted Average Price (VWAP)
export const calculateVWAP = (data: CandlestickData[]): number[] => {
  const vwap: number[] = [];
  let cumulativeTPV = 0; // Total Price * Volume
  let cumulativeVolume = 0;
  
  data.forEach(candle => {
    const typicalPrice = (candle.high + candle.low + candle.close) / 3;
    cumulativeTPV += typicalPrice * candle.volume;
    cumulativeVolume += candle.volume;
    
    vwap.push(cumulativeTPV / cumulativeVolume);
  });
  
  return vwap;
};

// Average True Range (ATR)
export const calculateATR = (data: CandlestickData[], period: number = 14): number[] => {
  const trueRanges: number[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;
    
    const tr1 = high - low;
    const tr2 = Math.abs(high - prevClose);
    const tr3 = Math.abs(low - prevClose);
    
    trueRanges.push(Math.max(tr1, tr2, tr3));
  }
  
  return calculateSMA(trueRanges, period);
};

// Stochastic Oscillator
export const calculateStochastic = (data: CandlestickData[], kPeriod: number = 14, dPeriod: number = 3) => {
  const kValues: number[] = [];
  
  for (let i = kPeriod - 1; i < data.length; i++) {
    const slice = data.slice(i - kPeriod + 1, i + 1);
    const highestHigh = Math.max(...slice.map(d => d.high));
    const lowestLow = Math.min(...slice.map(d => d.low));
    const currentClose = data[i].close;
    
    const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    kValues.push(k);
  }
  
  const dValues = calculateSMA(kValues, dPeriod);
  
  return {
    k: kValues,
    d: dValues
  };
};

// Williams %R
export const calculateWilliamsR = (data: CandlestickData[], period: number = 14): number[] => {
  const williamsR: number[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const highestHigh = Math.max(...slice.map(d => d.high));
    const lowestLow = Math.min(...slice.map(d => d.low));
    const currentClose = data[i].close;
    
    const wr = ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
    williamsR.push(wr);
  }
  
  return williamsR;
};

// Main function to calculate all technical indicators
export const calculateAllIndicators = (data: CandlestickData[]): TechnicalIndicators => {
  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);
  
  const rsi = calculateRSI(closes);
  const macd = calculateMACD(closes);
  const bollingerBands = calculateBollingerBands(closes);
  const supportResistance = findSupportResistance(data);
  const stochastic = calculateStochastic(data);
  const williamsR = calculateWilliamsR(data);
  
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const sma200 = calculateSMA(closes, 200);
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  
  // Calculate Fibonacci levels based on recent high/low
  const recentHigh = Math.max(...highs.slice(-20));
  const recentLow = Math.min(...lows.slice(-20));
  const fibonacci = {
    retracements: calculateFibonacciRetracements(recentHigh, recentLow),
    extensions: calculateFibonacciExtensions(recentHigh, recentLow, closes[closes.length - 1])
  };
  
  // Create temporary indicators object for signal generation
  const tempIndicators = {
    rsi: rsi[rsi.length - 1] || 0,
    macd: {
      macd: macd.macd[macd.macd.length - 1] || 0,
      signal: macd.signal[macd.signal.length - 1] || 0,
      histogram: macd.histogram[macd.histogram.length - 1] || 0
    },
    bollingerBands: {
      upper: bollingerBands.upper[bollingerBands.upper.length - 1] || 0,
      middle: bollingerBands.middle[bollingerBands.middle.length - 1] || 0,
      lower: bollingerBands.lower[bollingerBands.lower.length - 1] || 0
    },
    movingAverages: {
      sma20: sma20[sma20.length - 1] || 0,
      sma50: sma50[sma50.length - 1] || 0,
      sma200: sma200[sma200.length - 1] || 0,
      ema12: ema12[ema12.length - 1] || 0,
      ema26: ema26[ema26.length - 1] || 0
    },
    supportResistance,
    fibonacci
  };
  
  const signals = generateTradingSignals(tempIndicators);
  
  return {
    rsi: rsi[rsi.length - 1] || 0,
    macd: {
      macd: macd.macd[macd.macd.length - 1] || 0,
      signal: macd.signal[macd.signal.length - 1] || 0,
      histogram: macd.histogram[macd.histogram.length - 1] || 0
    },
    bollingerBands: {
      upper: bollingerBands.upper[bollingerBands.upper.length - 1] || 0,
      middle: bollingerBands.middle[bollingerBands.middle.length - 1] || 0,
      lower: bollingerBands.lower[bollingerBands.lower.length - 1] || 0
    },
    movingAverages: {
      sma20: sma20[sma20.length - 1] || 0,
      sma50: sma50[sma50.length - 1] || 0,
      sma200: sma200[sma200.length - 1] || 0,
      ema12: ema12[ema12.length - 1] || 0,
      ema26: ema26[ema26.length - 1] || 0
    },
    supportResistance,
    fibonacci,
    stochastic: {
      k: stochastic.k[stochastic.k.length - 1] || 0,
      d: stochastic.d[stochastic.d.length - 1] || 0
    },
    williamsR: williamsR[williamsR.length - 1] || 0,
    signals,
    supportLevels: supportResistance.support,
    resistanceLevels: supportResistance.resistance
  };
};

// Trading signals based on technical indicators
export const generateTradingSignals = (indicators: Partial<TechnicalIndicators>) => {
  const signals: string[] = [];
  
  // RSI signals
  if (indicators.rsi && indicators.rsi > 70) {
    signals.push('RSI: Overbought (>70) - Consider selling');
  } else if (indicators.rsi && indicators.rsi < 30) {
    signals.push('RSI: Oversold (<30) - Consider buying');
  }
  
  // MACD signals
  if (indicators.macd && indicators.macd.macd > indicators.macd.signal && indicators.macd.histogram > 0) {
    signals.push('MACD: Bullish crossover - Buy signal');
  } else if (indicators.macd && indicators.macd.macd < indicators.macd.signal && indicators.macd.histogram < 0) {
    signals.push('MACD: Bearish crossover - Sell signal');
  }
  
  // Bollinger Bands signals
  if (indicators.bollingerBands && indicators.bollingerBands.middle) {
    const currentPrice = indicators.bollingerBands.middle;
    if (currentPrice > indicators.bollingerBands.upper) {
      signals.push('Bollinger Bands: Price above upper band - Potential reversal');
    } else if (currentPrice < indicators.bollingerBands.lower) {
      signals.push('Bollinger Bands: Price below lower band - Potential bounce');
    }
  }
  
  // Moving Average signals
  if (indicators.movingAverages && indicators.movingAverages.sma20 > indicators.movingAverages.sma50) {
    signals.push('Moving Averages: Golden cross (SMA20 > SMA50) - Bullish');
  } else if (indicators.movingAverages && indicators.movingAverages.sma20 < indicators.movingAverages.sma50) {
    signals.push('Moving Averages: Death cross (SMA20 < SMA50) - Bearish');
  }
  
  return signals;
}; 