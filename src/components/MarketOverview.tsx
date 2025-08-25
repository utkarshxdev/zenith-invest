import React from 'react';
import { MarketInstrument } from '../types/market';
import { TrendingUp, TrendingDown, Activity, IndianRupee, Building2, BarChart3 } from 'lucide-react';

interface MarketOverviewProps {
  instruments: MarketInstrument[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ instruments }) => {
  const totalInstruments = instruments.length;
  const gainers = instruments.filter(i => i.daily_change > 0).length;
  const losers = instruments.filter(i => i.daily_change < 0).length;
  const unchanged = totalInstruments - gainers - losers;
  
  const stocks = instruments.filter(i => i.type === 'stock');
  const indices = instruments.filter(i => i.type === 'index');
  
  const avgStockChange = stocks.length > 0 
    ? stocks.reduce((sum, i) => sum + i.daily_change_percent, 0) / stocks.length 
    : 0;
    
  const niftyData = instruments.find(i => i.symbol === 'NIFTY');
  const sensexData = instruments.find(i => i.symbol === 'SENSEX');

  const stats = [
    {
      title: 'Total Instruments',
      value: totalInstruments,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Gainers',
      value: gainers,
      subtitle: `${((gainers / totalInstruments) * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Losers',
      value: losers,
      subtitle: `${((losers / totalInstruments) * 100).toFixed(1)}%`,
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Market Sentiment',
      value: `${avgStockChange >= 0 ? '+' : ''}${avgStockChange.toFixed(2)}%`,
      subtitle: avgStockChange >= 0 ? 'Bullish' : 'Bearish',
      icon: BarChart3,
      color: avgStockChange >= 0 ? 'text-emerald-600' : 'text-red-500',
      bgColor: avgStockChange >= 0 ? 'bg-emerald-50' : 'bg-red-50',
      borderColor: avgStockChange >= 0 ? 'border-emerald-200' : 'border-red-200'
    }
  ];

  return (
    <div className="space-y-8 mb-12">
      {/* Major Indices */}
      {(niftyData || sensexData) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {niftyData && (
            <div className={`
              relative overflow-hidden rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105
              ${niftyData.daily_change >= 0 ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}
              backdrop-blur-sm
            `}>
              <div className="absolute inset-0 bg-white/50"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <BarChart3 className="w-10 h-10 text-indigo-600" />
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">NIFTY 50</h3>
                      <p className="text-slate-600">NSE</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900">
                      {niftyData.current_price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-lg font-semibold ${niftyData.daily_change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {niftyData.daily_change >= 0 ? '+' : ''}{niftyData.daily_change.toFixed(2)} ({niftyData.daily_change_percent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {sensexData && (
            <div className={`
              relative overflow-hidden rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105
              ${sensexData.daily_change >= 0 ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}
              backdrop-blur-sm
            `}>
              <div className="absolute inset-0 bg-white/50"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <BarChart3 className="w-10 h-10 text-amber-600" />
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">SENSEX</h3>
                      <p className="text-slate-600">BSE</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900">
                      {sensexData.current_price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-lg font-semibold ${sensexData.daily_change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {sensexData.daily_change >= 0 ? '+' : ''}{sensexData.daily_change.toFixed(2)} ({sensexData.daily_change_percent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Market Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`
              relative overflow-hidden rounded-2xl border ${stat.borderColor} ${stat.bgColor}
              backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl
              shadow-lg group
            `}
          >
            <div className="absolute inset-0 bg-white/50"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2 font-medium">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-slate-500 mt-1 font-medium">{stat.subtitle}</p>
                  )}
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;