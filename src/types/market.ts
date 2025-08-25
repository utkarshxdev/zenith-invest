export interface MarketInstrument {
  symbol: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'forex' | 'index';
  current_price: number;
  daily_change: number;
  daily_change_percent: number;
  last_updated: string;
  market?: 'NSE' | 'BSE';
  currency: 'INR' | 'USD';
  volume?: number;
  market_cap?: number;
  high?: number;
  low?: number;
  open?: number;
  previous_close?: number;
}

export interface MarketDataResponse {
  success: boolean;
  market_data: MarketInstrument[];
  total_instruments: number;
  last_updated: string;
  error?: string;
}

export interface NSEQuoteResponse {
  symbol: string;
  companyName: string;
  industry: string;
  activeSeries: string[];
  debtSeries: string[];
  tempSuspendedSeries: string[];
  isFNOSec: boolean;
  isCASec: boolean;
  isSLBSec: boolean;
  isDebtSec: boolean;
  isSuspended: boolean;
  isETFSec: boolean;
  isDelisted: boolean;
  isin: string;
  slb_isin: string;
  priceInfo: {
    lastPrice: number;
    change: number;
    pChange: number;
    previousClose: number;
    open: number;
    close: number;
    vwap: number;
    lowerCP: string;
    upperCP: string;
    pPriceBand: string;
    basePrice: number;
    intraDayHighLow: {
      min: number;
      max: number;
      value: number;
    };
    weekHighLow: {
      min: number;
      minDate: string;
      max: number;
      maxDate: string;
      value: number;
    };
  };
  industryInfo: {
    macro: string;
    sector: string;
    industry: string;
    basicIndustry: string;
  };
  preOpenMarket: {
    preopen: any[];
    ato: {
      buy: number;
      sell: number;
    };
    IEP: number;
    totalTradedVolume: number;
    finalPrice: number;
    finalQuantity: number;
    lastUpdateTime: string;
    totalBuyQuantity: number;
    totalSellQuantity: number;
    atoBuyQty: number;
    atoSellQty: number;
  };
}