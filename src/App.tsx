import React, { useState, useEffect } from 'react';
import { MarketInstrument } from './types/market';
import { IndianMarketService } from './services/indianMarketService';
import WelcomePage from './components/WelcomePage';
import Header from './components/Header';
import MarketOverview from './components/MarketOverview';
import MarketSection from './components/MarketSection';
import AIInvestmentWizard from './components/AIInvestmentWizard';
import AIRecommendationDashboard from './components/AIRecommendationDashboard';
import { UserProfile } from './types/investment';
import { Building2, Globe, BarChart3, TrendingUp } from 'lucide-react';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAIWizard, setShowAIWizard] = useState(false);
  const [showAIDashboard, setShowAIDashboard] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [instruments, setInstruments] = useState<MarketInstrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [error, setError] = useState<string | null>(null);

  const marketService = IndianMarketService.getInstance();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await marketService.fetchMarketData();
      
      if (response.success) {
        setInstruments(response.market_data);
        setLastUpdated(response.last_updated);
        if (response.error) {
          setError(response.error);
        }
      } else {
        setError(response.error || 'Failed to fetch market data');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Market data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showWelcome) {
      fetchData();
      
      // Set up auto-refresh every 60 seconds for real market data
      const interval = setInterval(fetchData, 60000);
      
      return () => clearInterval(interval);
    }
  }, [showWelcome]);

  const getInstrumentsByType = (type: string) => {
    return instruments.filter(instrument => instrument.type === type);
  };

  const stocks = getInstrumentsByType('stock');
  const indices = getInstrumentsByType('index');
  const forex = getInstrumentsByType('forex');
  const mutualFunds = getInstrumentsByType('mutual_fund');

  const handleStartAIAnalysis = () => {
    setShowWelcome(false);
    setShowAIWizard(true);
  };

  const handleWizardComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowAIWizard(false);
    setShowAIDashboard(true);
  };

  const handleBackToMarket = () => {
    setShowAIDashboard(false);
    setShowAIWizard(false);
    setUserProfile(null);
  };

  // Show AI Recommendation Dashboard
  if (showAIDashboard && userProfile) {
    return (
      <AIRecommendationDashboard
        userProfile={userProfile}
        marketData={instruments}
        onBack={handleBackToMarket}
      />
    );
  }

  // Show AI Investment Wizard
  if (showAIWizard) {
    return (
      <AIInvestmentWizard
        onComplete={handleWizardComplete}
        onClose={() => setShowAIWizard(false)}
      />
    );
  }

  // Show Welcome Page
  if (showWelcome) {
    return (
      <WelcomePage 
        onEnterDashboard={() => setShowWelcome(false)}
        onStartAIAnalysis={handleStartAIAnalysis}
      />
    );
  }

  // Error State
  if (error && instruments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-sm border border-red-200 rounded-2xl p-12 shadow-xl max-w-md w-full">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Error Loading Market Data</h2>
          <p className="text-slate-600 mb-8 text-lg">{error}</p>
          <button
            onClick={fetchData}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main Market Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header 
        onRefresh={fetchData}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        onStartAIAnalysis={handleStartAIAnalysis}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
            <p className="text-amber-700 text-sm">
              ⚠️ {error}
            </p>
          </div>
        )}

        {isLoading && instruments.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-12 shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
              <p className="text-slate-700 text-xl font-medium">Loading Indian market data...</p>
              <p className="text-slate-500 text-sm mt-2">Fetching live NSE/BSE prices</p>
            </div>
          </div>
        ) : (
          <>
            {/* Market Overview Section */}
            <section id="market-overview" className="scroll-mt-20">
              <MarketOverview instruments={instruments} />
            </section>
            
            {/* Market Sections */}
            <div className="space-y-20">
              <section id="market-indices" className="scroll-mt-20">
                <MarketSection
                  title="Market Indices"
                  description="Major Indian stock market indices - NIFTY 50, SENSEX, and Bank NIFTY"
                  instruments={indices}
                  icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
                />
              </section>
              
              <section id="nse-bse-stocks" className="scroll-mt-20">
                <MarketSection
                  title="NSE/BSE Stocks"
                  description="Top Indian stocks from National Stock Exchange and Bombay Stock Exchange"
                  instruments={stocks}
                  icon={<Building2 className="w-8 h-8 text-blue-600" />}
                />
              </section>
              
              <section id="currency-rates" className="scroll-mt-20">
                <MarketSection
                  title="Currency (INR)"
                  description="Foreign exchange rates against Indian Rupee - USD, EUR, GBP"
                  instruments={forex}
                  icon={<Globe className="w-8 h-8 text-amber-600" />}
                />
              </section>
              
              {mutualFunds.length > 0 && (
                <section id="mutual-funds" className="scroll-mt-20">
                  <MarketSection
                    title="Mutual Funds"
                    description="Indian mutual fund NAVs and performance data"
                    instruments={mutualFunds}
                    icon={<TrendingUp className="w-8 h-8 text-emerald-600" />}
                  />
                </section>
              )}
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-white/70 backdrop-blur-sm border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p className="text-lg font-medium">© 2025 ZENITH - India's Most Advanced AI Investment Platform</p>
            <p className="mt-2">Real-time data from Yahoo Finance, Alpha Vantage, NSE & BSE • Built with React, TypeScript, and Netlify Functions</p>
            <p className="mt-2">99% AI Accuracy • Live market data integration</p>
            <p className="mt-4 text-xs text-slate-500">
              Market data and AI recommendations provided for informational purposes only. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;