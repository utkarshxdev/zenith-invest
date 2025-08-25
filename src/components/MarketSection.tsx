import React from 'react';
import { MarketInstrument } from '../types/market';
import MarketCard from './MarketCard';

interface MarketSectionProps {
  title: string;
  instruments: MarketInstrument[];
  icon: React.ReactNode;
  description?: string;
}

const MarketSection: React.FC<MarketSectionProps> = ({ title, instruments, icon, description }) => {
  if (instruments.length === 0) return null;

  const gainers = instruments.filter(i => i.daily_change > 0).length;
  const losers = instruments.filter(i => i.daily_change < 0).length;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          {icon}
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
            {description && (
              <p className="text-slate-600 text-lg mt-1">{description}</p>
            )}
          </div>
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
            {instruments.length} instruments
          </span>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-600 font-medium">Gainers: {gainers}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-600 font-medium">Losers: {losers}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {instruments.map((instrument) => (
          <MarketCard key={instrument.symbol} instrument={instrument} />
        ))}
      </div>
    </div>
  );
};

export default MarketSection;