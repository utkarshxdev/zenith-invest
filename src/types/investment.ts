export interface UserProfile {
  id: string;
  personalDetails: {
    name: string;
    age: number;
    occupation: string;
    monthlyIncome: number;
    currentSavings: number;
    dependents: number;
  };
  financialGoals: {
    investmentHorizon: 'short' | 'medium' | 'long'; // 1-3, 3-7, 7+ years
    primaryGoal: 'wealth_creation' | 'retirement' | 'child_education' | 'home_purchase' | 'emergency_fund';
    targetAmount?: number;
    monthlyInvestment: number;
  };
  riskProfile: {
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    riskScore: number; // 1-10
    volatilityComfort: number; // 1-10
    previousInvestmentExperience: 'none' | 'basic' | 'intermediate' | 'advanced';
  };
  preferences: {
    preferredSectors: string[];
    avoidSectors: string[];
    esgPreference: boolean;
    taxSavingPreference: boolean;
  };
  createdAt: string;
  lastUpdated: string;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  portfolioAllocation: {
    equity: number;
    debt: number;
    gold: number;
    international: number;
    cash: number;
  };
  recommendedInstruments: RecommendedInstrument[];
  expectedReturns: {
    conservative: number;
    realistic: number;
    optimistic: number;
  };
  riskMetrics: {
    portfolioRisk: number;
    maxDrawdown: number;
    sharpeRatio: number;
    volatility: number;
  };
  reasoning: string[];
  confidence: number; // 0-100
  rebalanceFrequency: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';
  createdAt: string;
  validUntil: string;
}

export interface RecommendedInstrument {
  symbol: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'etf' | 'bond' | 'gold_etf';
  allocation: number; // percentage
  investmentAmount: number;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  sector?: string;
  marketCap?: 'large' | 'mid' | 'small';
  rating: number; // 1-5 stars
  expense_ratio?: number;
  fund_manager?: string;
}

export interface MarketPattern {
  pattern: string;
  confidence: number;
  timeframe: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  instruments: string[];
}

export interface AIInsight {
  type: 'market_trend' | 'sector_rotation' | 'risk_alert' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  recommendation?: string;
  affectedInstruments: string[];
  confidence: number;
  timestamp: string;
}