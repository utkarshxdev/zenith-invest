import React, { useState } from 'react';
import { MarketInstrument } from '../types/market';
import { TrendingUp, TrendingDown, Building2, Globe, BarChart3, IndianRupee, Eye, X } from 'lucide-react';

interface MarketCardProps {
  instrument: MarketInstrument;
}

const MarketCard: React.FC<MarketCardProps> = ({ instrument }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isPositive = instrument.daily_change >= 0;
  const changeColor = isPositive ? 'text-emerald-600' : 'text-red-500';
  const bgColor = isPositive ? 'bg-emerald-50' : 'bg-red-50';
  const borderColor = isPositive ? 'border-emerald-200' : 'border-red-200';

  const getIcon = () => {
    switch (instrument.type) {
      case 'stock':
        return <Building2 className="w-6 h-6 text-blue-600" />;
      case 'index':
        return <BarChart3 className="w-6 h-6 text-indigo-600" />;
      case 'forex':
        return <Globe className="w-6 h-6 text-amber-600" />;
      case 'mutual_fund':
        return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      default:
        return <IndianRupee className="w-6 h-6 text-slate-600" />;
    }
  };

  const formatPrice = (price: number) => {
    if (instrument.type === 'forex') {
      return `₹${price.toFixed(2)}`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)}Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)}L`;
    }
    return `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const formatVolume = (volume?: number) => {
    if (!volume) return 'N/A';
    if (volume >= 10000000) {
      return `${(volume / 10000000).toFixed(2)}Cr`;
    }
    if (volume >= 100000) {
      return `${(volume / 100000).toFixed(2)}L`;
    }
    return volume.toLocaleString('en-IN');
  };

  const getMarketBadge = () => {
    if (instrument.market) {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-200">
          {instrument.market}
        </span>
      );
    }
    return null;
  };

  const getTypeLabel = () => {
    const labels = {
      stock: 'STOCK',
      index: 'INDEX',
      forex: 'FOREX',
      mutual_fund: 'MF'
    };
    return labels[instrument.type] || instrument.type.toUpperCase();
  };

  // Generate mini chart data (mock)
  const generateMiniChart = () => {
    const points = [];
    const baseValue = 50;
    for (let i = 0; i < 20; i++) {
      const variation = (Math.random() - 0.5) * 20;
      points.push(baseValue + variation + (instrument.daily_change_percent * i * 0.5));
    }
    return points;
  };

  const chartPoints = generateMiniChart();
  const maxPoint = Math.max(...chartPoints);
  const minPoint = Math.min(...chartPoints);

  return (
    <>
      <div className={`
        relative overflow-hidden rounded-2xl border ${borderColor} ${bgColor}
        backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl
        shadow-lg group cursor-pointer
      `}>
        <div className="absolute inset-0 bg-white/50" />
        
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{instrument.symbol}</h3>
                <p className="text-slate-600 text-sm truncate max-w-[200px]">{instrument.name}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {getMarketBadge()}
              <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                {getTypeLabel()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {formatPrice(instrument.current_price)}
              </span>
              <div className="flex items-center space-x-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className={`font-semibold ${changeColor}`}>
                {isPositive ? '+' : ''}₹{Math.abs(instrument.daily_change).toFixed(2)}
              </span>
              <span className={`font-semibold ${changeColor}`}>
                {isPositive ? '+' : ''}{instrument.daily_change_percent.toFixed(2)}%
              </span>
            </div>

            {/* Mini Chart */}
            <div className="h-12 w-full">
              <svg className="w-full h-full" viewBox="0 0 200 48">
                <polyline
                  fill="none"
                  stroke={isPositive ? '#059669' : '#dc2626'}
                  strokeWidth="2"
                  points={chartPoints.map((point, index) => 
                    `${index * 10},${48 - ((point - minPoint) / (maxPoint - minPoint)) * 40}`
                  ).join(' ')}
                />
              </svg>
            </div>

            {(instrument.high || instrument.low || instrument.volume) && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                {instrument.high && instrument.low && (
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>High: ₹{instrument.high.toFixed(2)}</span>
                    <span>Low: ₹{instrument.low.toFixed(2)}</span>
                  </div>
                )}
                {instrument.volume && (
                  <div className="text-xs text-slate-600">
                    Volume: {formatVolume(instrument.volume)}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Updated: {new Date(instrument.last_updated).toLocaleTimeString('en-IN')}
              </p>
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                <Eye className="w-3 h-3" />
                <span>Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getIcon()}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{instrument.symbol}</h2>
                    <p className="text-slate-600">{instrument.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Price Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-slate-600 text-sm mb-1">Current Price</p>
                  <p className="text-2xl font-bold text-slate-900">{formatPrice(instrument.current_price)}</p>
                </div>
                <div className={`rounded-xl p-4 border ${borderColor} ${bgColor}`}>
                  <p className="text-slate-600 text-sm mb-1">Daily Change</p>
                  <p className={`text-2xl font-bold ${changeColor}`}>
                    {isPositive ? '+' : ''}{instrument.daily_change_percent.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Extended Chart */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-slate-900 font-semibold mb-4">Price Movement</h3>
                <div className="h-32 w-full">
                  <svg className="w-full h-full" viewBox="0 0 400 128">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={isPositive ? '#059669' : '#dc2626'} stopOpacity="0.3"/>
                        <stop offset="100%" stopColor={isPositive ? '#059669' : '#dc2626'} stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="url(#chartGradient)"
                      stroke={isPositive ? '#059669' : '#dc2626'}
                      strokeWidth="2"
                      points={`0,128 ${chartPoints.map((point, index) => 
                        `${index * 20},${128 - ((point - minPoint) / (maxPoint - minPoint)) * 100}`
                      ).join(' ')} 400,128`}
                    />
                  </svg>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-4">
                {instrument.high && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-slate-600 text-sm">Day High</p>
                    <p className="text-slate-900 font-semibold">₹{instrument.high.toFixed(2)}</p>
                  </div>
                )}
                {instrument.low && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-slate-600 text-sm">Day Low</p>
                    <p className="text-slate-900 font-semibold">₹{instrument.low.toFixed(2)}</p>
                  </div>
                )}
                {instrument.open && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-slate-600 text-sm">Open</p>
                    <p className="text-slate-900 font-semibold">₹{instrument.open.toFixed(2)}</p>
                  </div>
                )}
                {instrument.previous_close && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-slate-600 text-sm">Previous Close</p>
                    <p className="text-slate-900 font-semibold">₹{instrument.previous_close.toFixed(2)}</p>
                  </div>
                )}
              </div>

              {instrument.volume && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-slate-600 text-sm mb-1">Volume</p>
                  <p className="text-slate-900 font-semibold">{formatVolume(instrument.volume)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketCard;