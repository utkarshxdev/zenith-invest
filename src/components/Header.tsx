import React from 'react';
import { BarChart3, RefreshCw, MapPin, Brain } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: string;
  onStartAIAnalysis: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading, lastUpdated, onStartAIAnalysis }) => {
  const istTime = new Date(lastUpdated).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const istDate = new Date(lastUpdated).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">ZENITH Market Dashboard</h1>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <MapPin className="w-3 h-3" />
                <span>NSE • BSE • Live Data</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-500">Last updated (IST)</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-slate-900">{istTime}</p>
                <span className="text-xs text-slate-400">•</span>
                <p className="text-xs text-slate-500">{istDate}</p>
              </div>
            </div>
            
            <button
              onClick={onStartAIAnalysis}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md"
            >
              <Brain className="w-4 h-4" />
              <span>AI Analysis</span>
            </button>
            
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                transition-all duration-200 hover:scale-105 shadow-md
                ${isLoading 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg'
                }
              `}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;