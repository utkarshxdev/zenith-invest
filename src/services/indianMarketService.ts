import { MarketDataResponse, MarketInstrument, NSEQuoteResponse } from '../types/market';

export class IndianMarketService {
  private static instance: IndianMarketService;
  private readonly FUNCTION_URL = this.getFunctionUrl();
  
  // Indian market instruments to track
  private readonly instruments = [
    // NSE Stocks
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', type: 'stock', market: 'NSE' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', type: 'stock', market: 'NSE' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', type: 'stock', market: 'NSE' },
    { symbol: 'INFY', name: 'Infosys Ltd', type: 'stock', market: 'NSE' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', type: 'stock', market: 'NSE' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', type: 'stock', market: 'NSE' },
    { symbol: 'ITC', name: 'ITC Ltd', type: 'stock', market: 'NSE' },
    { symbol: 'SBIN', name: 'State Bank of India', type: 'stock', market: 'NSE' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', type: 'stock', market: 'NSE' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', type: 'stock', market: 'NSE' },
    { symbol: 'LT', name: 'Larsen & Toubro Ltd', type: 'stock', market: 'NSE' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', type: 'stock', market: 'NSE' },
    
    // Major Indices
    { symbol: 'NIFTY', name: 'Nifty 50', type: 'index', market: 'NSE' },
    { symbol: 'BANKNIFTY', name: 'Bank Nifty', type: 'index', market: 'NSE' },
    { symbol: 'SENSEX', name: 'BSE Sensex', type: 'index', market: 'BSE' },
    
    // Forex pairs with INR
    { symbol: 'USDINR', name: 'USD/INR', type: 'forex', market: 'NSE' },
    { symbol: 'EURINR', name: 'EUR/INR', type: 'forex', market: 'NSE' },
    { symbol: 'GBPINR', name: 'GBP/INR', type: 'forex', market: 'NSE' },
  ];

  private constructor() {}

  public static getInstance(): IndianMarketService {
    if (!IndianMarketService.instance) {
      IndianMarketService.instance = new IndianMarketService();
    }
    return IndianMarketService.instance;
  }

  private getFunctionUrl(): string {
    // Use local Netlify dev server when running locally, otherwise use deployed function
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8888/.netlify/functions/market-data';
    }
    return '/.netlify/functions/market-data';
  }

  public async fetchMarketData(): Promise<MarketDataResponse> {
    try {
      console.log(`Fetching real-time market data from: ${this.FUNCTION_URL}`);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      // Add timeout to detect if netlify dev is not running
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for local development
      
      const response = await fetch(this.FUNCTION_URL, {
        method: 'GET',
        headers,
        mode: 'cors',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Successfully fetched ${data.total_instruments} instruments`);
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch market data');
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⚠️ Netlify function not responding (timeout after 10s)');
        console.log('💡 Function may be cold starting or temporarily unavailable');
      } else {
        console.error('❌ Error fetching real-time market data:', error);
      }
      
      // Fallback to enhanced mock data
      console.log('🔄 Falling back to enhanced simulated market data...');
      const mockData = this.generateEnhancedMockData();
      
      return {
        success: true,
        market_data: mockData.market_data,
        total_instruments: mockData.total_instruments,
        last_updated: new Date().toISOString(),
        error: error.name === 'AbortError' 
          ? 'Using enhanced simulated data - Netlify function temporarily unavailable'
          : `Using enhanced simulated data - Function temporarily unavailable: ${error.message}`,
      };
    }
  }
  
  private generateEnhancedMockData(): { market_data: MarketInstrument[], total_instruments: number } {
    // Enhanced mock data with more realistic variations
    const priceRanges: Record<string, { min: number; max: number }> = {
      'RELIANCE': { min: 2400, max: 2900 },
      'TCS': { min: 3500, max: 4200 },
      'HDFCBANK': { min: 1500, max: 1900 },
      'INFY': { min: 1400, max: 1800 },
      'ICICIBANK': { min: 1000, max: 1300 },
      'HINDUNILVR': { min: 2400, max: 2900 },
      'ITC': { min: 380, max: 480 },
      'SBIN': { min: 550, max: 750 },
      'BHARTIARTL': { min: 900, max: 1300 },
      'KOTAKBANK': { min: 1700, max: 2100 },
      'LT': { min: 3000, max: 3700 },
      'ASIANPAINT': { min: 3000, max: 3700 },
      'NIFTY': { min: 22000, max: 24000 },
      'BANKNIFTY': { min: 47000, max: 52000 },
      'SENSEX': { min: 72000, max: 78000 },
      'USDINR': { min: 83, max: 85 },
      'EURINR': { min: 89, max: 93 },
      'GBPINR': { min: 102, max: 107 },
    };

    const marketData = this.instruments.map(instrument => {
      const range = priceRanges[instrument.symbol] || { min: 100, max: 1000 };
      
      // Use time-based seed for more realistic variations that change over time
      const timeSeed = Math.floor(Date.now() / (1000 * 60 * 5)); // Changes every 5 minutes
      const random1 = Math.sin(timeSeed * 0.1 + instrument.symbol.length) * 0.5 + 0.5;
      const random2 = Math.sin(timeSeed * 0.2 + instrument.symbol.charCodeAt(0)) * 0.5 + 0.5;
      
      const basePrice = range.min + random1 * (range.max - range.min);
      
      // Generate more realistic daily changes (-4% to +4%)
      const changePercent = (random2 - 0.5) * 8;
      const change = basePrice * (changePercent / 100);
      const currentPrice = basePrice + change;

      return {
        symbol: instrument.symbol,
        name: instrument.name,
        type: instrument.type as any,
        current_price: Math.round(currentPrice * 100) / 100,
        daily_change: Math.round(change * 100) / 100,
        daily_change_percent: Math.round(changePercent * 100) / 100,
        last_updated: new Date().toISOString(),
        market: instrument.market as any,
        currency: 'INR' as const,
        volume: Math.floor(random1 * 10000000),
        high: Math.round((currentPrice + Math.abs(change) * 0.7) * 100) / 100,
        low: Math.round((currentPrice - Math.abs(change) * 0.7) * 100) / 100,
        open: Math.round((basePrice + (random2 - 0.5) * change) * 100) / 100,
        previous_close: Math.round(basePrice * 100) / 100,
      };
    });

    return {
      market_data: marketData,
      total_instruments: marketData.length,
    };
  }
  public getInstrumentsByType(type: string): MarketInstrument[] {
    const mockData = this.generateEnhancedMockData();
    return mockData.market_data.filter(instrument => instrument.type === type);
  }
}