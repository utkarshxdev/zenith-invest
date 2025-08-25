import { MarketDataResponse, MarketInstrument } from '../types/market';

// Mock data for demonstration - in production, this would connect to your API
const mockMarketData: MarketInstrument[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    current_price: 178.25,
    daily_change: 2.15,
    daily_change_percent: 1.22,
    last_updated: "2025-01-08"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "stock",
    current_price: 2847.50,
    daily_change: -18.30,
    daily_change_percent: -0.64,
    last_updated: "2025-01-08"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    type: "stock",
    current_price: 412.89,
    daily_change: 5.67,
    daily_change_percent: 1.39,
    last_updated: "2025-01-08"
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "stock",
    current_price: 238.45,
    daily_change: -12.33,
    daily_change_percent: -4.92,
    last_updated: "2025-01-08"
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    type: "etf",
    current_price: 472.31,
    daily_change: 3.21,
    daily_change_percent: 0.68,
    last_updated: "2025-01-08"
  },
  {
    symbol: "EUR/USD",
    name: "EUR/USD",
    type: "forex",
    current_price: 1.0234,
    daily_change: 0.0012,
    daily_change_percent: 0.12,
    last_updated: "2025-01-08"
  },
  {
    symbol: "GBP/USD",
    name: "GBP/USD",
    type: "forex",
    current_price: 1.2156,
    daily_change: -0.0087,
    daily_change_percent: -0.71,
    last_updated: "2025-01-08"
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    type: "crypto",
    current_price: 95432.18,
    daily_change: 1823.45,
    daily_change_percent: 1.95,
    last_updated: "2025-01-08"
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    type: "crypto",
    current_price: 3567.89,
    daily_change: -89.12,
    daily_change_percent: -2.44,
    last_updated: "2025-01-08"
  }
];

export class MarketService {
  private static instance: MarketService;
  private data: MarketInstrument[] = [];

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): MarketService {
    if (!MarketService.instance) {
      MarketService.instance = new MarketService();
    }
    return MarketService.instance;
  }

  private initializeData(): void {
    this.data = [...mockMarketData];
    this.simulatePriceUpdates();
  }

  private simulatePriceUpdates(): void {
    setInterval(() => {
      this.data = this.data.map(instrument => {
        const volatility = instrument.type === 'crypto' ? 0.05 : 
                          instrument.type === 'stock' ? 0.02 : 0.01;
        
        const changePercent = (Math.random() - 0.5) * volatility * 2;
        const priceChange = instrument.current_price * changePercent;
        
        return {
          ...instrument,
          current_price: Math.max(0.01, instrument.current_price + priceChange),
          daily_change: instrument.daily_change + priceChange,
          daily_change_percent: instrument.daily_change_percent + changePercent,
          last_updated: new Date().toISOString().split('T')[0]
        };
      });
    }, 3000);
  }

  public async fetchMarketData(): Promise<MarketDataResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      market_data: [...this.data],
      total_instruments: this.data.length,
      last_updated: new Date().toISOString()
    };
  }

  public getInstrumentsByType(type: string): MarketInstrument[] {
    return this.data.filter(instrument => instrument.type === type);
  }
}