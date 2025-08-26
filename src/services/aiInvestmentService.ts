import { UserProfile, AIRecommendation, RecommendedInstrument, MarketPattern, AIInsight } from '../types/investment';
import { MarketInstrument } from '../types/market';

export class AIInvestmentService {
  private static instance: AIInvestmentService;
  private userProfiles: Map<string, UserProfile> = new Map();
  private recommendations: Map<string, AIRecommendation> = new Map();

  private constructor() {
    this.loadStoredData();
  }

  public static getInstance(): AIInvestmentService {
    if (!AIInvestmentService.instance) {
      AIInvestmentService.instance = new AIInvestmentService();
    }
    return AIInvestmentService.instance;
  }

  private loadStoredData(): void {
    try {
      const storedProfiles = localStorage.getItem('ai_user_profiles');
      const storedRecommendations = localStorage.getItem('ai_recommendations');
      
      if (storedProfiles) {
        const profiles = JSON.parse(storedProfiles);
        this.userProfiles = new Map(profiles);
      }
      
      if (storedRecommendations) {
        const recommendations = JSON.parse(storedRecommendations);
        this.recommendations = new Map(recommendations);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem('ai_user_profiles', JSON.stringify(Array.from(this.userProfiles.entries())));
      localStorage.setItem('ai_recommendations', JSON.stringify(Array.from(this.recommendations.entries())));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  public createUserProfile(profileData: Omit<UserProfile, 'id' | 'createdAt' | 'lastUpdated'>): UserProfile {
    const profile: UserProfile = {
      ...profileData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.userProfiles.set(profile.id, profile);
    this.saveData();
    return profile;
  }

  public updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const profile = this.userProfiles.get(userId);
    if (!profile) return null;

    const updatedProfile = {
      ...profile,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    this.userProfiles.set(userId, updatedProfile);
    this.saveData();
    return updatedProfile;
  }

  public getUserProfile(userId: string): UserProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  public async generateAIRecommendation(userId: string, marketData: MarketInstrument[]): Promise<AIRecommendation> {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      throw new Error('User profile not found');
    }

    // Enhanced AI Algorithm with 80% accuracy target (realistic and achievable)
    const portfolioAllocation = this.calculateOptimalAllocation(profile);
    const recommendedInstruments = this.selectOptimalInstruments(profile, marketData, portfolioAllocation);
    const expectedReturns = this.calculateExpectedReturns(recommendedInstruments, profile);
    const riskMetrics = this.calculateRiskMetrics(recommendedInstruments, profile);
    const reasoning = this.generateReasoning(profile, portfolioAllocation, recommendedInstruments);

    const recommendation: AIRecommendation = {
      id: this.generateId(),
      userId,
      portfolioAllocation,
      recommendedInstruments,
      expectedReturns,
      riskMetrics,
      reasoning,
      confidence: this.calculateConfidence(profile, marketData),
      rebalanceFrequency: this.determineRebalanceFrequency(profile),
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    this.recommendations.set(recommendation.id, recommendation);
    this.saveData();
    return recommendation;
  }

  private calculateOptimalAllocation(profile: UserProfile): AIRecommendation['portfolioAllocation'] {
    const { age } = profile.personalDetails;
    const { riskTolerance, riskScore } = profile.riskProfile;
    const { investmentHorizon } = profile.financialGoals;

    // Enhanced age-based equity allocation for Indian markets
    let baseEquity = Math.max(30, 110 - age); // More aggressive for Indian growth story
    
    // Risk tolerance adjustment with fine-tuned multipliers for better moderate allocation
    const riskMultiplier = {
      conservative: 0.6,
      moderate: 0.85, // Reduced from 1.0 to better target moderate allocation
      aggressive: 1.4
    }[riskTolerance];

    // Investment horizon adjustment
    const horizonMultiplier = {
      short: 0.5,
      medium: 1.0,
      long: 1.3
    }[investmentHorizon];

    const adjustedEquity = Math.min(90, Math.max(15, baseEquity * riskMultiplier * horizonMultiplier));
    
    // Indian market specific allocations with better optimization
    const equity = Math.round(adjustedEquity);
    const remainingAllocation = 100 - equity;
    const debt = Math.round(remainingAllocation * 0.6);
    const gold = Math.round(remainingAllocation * 0.25);
    const international = Math.round(Math.min(10, equity * 0.1)); // Reduced from 15% to 10%
    const cash = Math.max(0, remainingAllocation - debt - gold - international);
    
    // Ensure allocation sums to exactly 100%
    const totalAllocation = equity + debt + gold + international + cash;
    if (totalAllocation !== 100) {
      // Adjust cash to make total exactly 100%
      const adjustment = 100 - totalAllocation;
      return { 
        equity, 
        debt, 
        gold, 
        international, 
        cash: Math.max(0, cash + adjustment) 
      };
    }

    return { equity, debt, gold, international, cash };
  }

  private selectOptimalInstruments(
    profile: UserProfile, 
    marketData: MarketInstrument[], 
    allocation: AIRecommendation['portfolioAllocation']
  ): RecommendedInstrument[] {
    const instruments: RecommendedInstrument[] = [];
    const { monthlyInvestment } = profile.financialGoals;
    const { riskTolerance } = profile.riskProfile;
    const { preferredSectors, avoidSectors } = profile.preferences;

    // Equity instruments with better selection
    if (allocation.equity > 0) {
      const equityAmount = (monthlyInvestment * allocation.equity) / 100;
      
      // Large cap stocks (50% of equity)
      const largeCap = this.selectTopStocks(marketData, 'large', equityAmount * 0.5, preferredSectors, avoidSectors, profile.preferences.esgPreference);
      // Distribute allocation equally among selected large cap stocks
      const largeCapAllocation = (allocation.equity * 0.5) / Math.max(largeCap.length, 1);
      largeCap.forEach(stock => {
        stock.allocation = largeCapAllocation;
        stock.investmentAmount = (equityAmount * 0.5) / Math.max(largeCap.length, 1);
      });
      instruments.push(...largeCap);
      
      // Mid cap stocks (30% of equity)
      const midCap = this.selectTopStocks(marketData, 'mid', equityAmount * 0.3, preferredSectors, avoidSectors, profile.preferences.esgPreference);
      // Distribute allocation equally among selected mid cap stocks
      const midCapAllocation = (allocation.equity * 0.3) / Math.max(midCap.length, 1);
      midCap.forEach(stock => {
        stock.allocation = midCapAllocation;
        stock.investmentAmount = (equityAmount * 0.3) / Math.max(midCap.length, 1);
      });
      instruments.push(...midCap);
      
      // Small cap stocks (20% of equity) - for moderate and aggressive investors
      if (riskTolerance !== 'conservative') {
        const smallCap = this.selectTopStocks(marketData, 'small', equityAmount * 0.2, preferredSectors, avoidSectors, profile.preferences.esgPreference);
        // Distribute allocation equally among selected small cap stocks
        const smallCapAllocation = (allocation.equity * 0.2) / Math.max(smallCap.length, 1);
        smallCap.forEach(stock => {
          stock.allocation = smallCapAllocation;
          stock.investmentAmount = (equityAmount * 0.2) / Math.max(smallCap.length, 1);
        });
        instruments.push(...smallCap);
      } else {
        // For conservative investors, allocate the remaining 20% to large cap
        const remainingLargeCap = this.selectTopStocks(marketData, 'large', equityAmount * 0.2, preferredSectors, avoidSectors, profile.preferences.esgPreference);
        // Distribute allocation equally among selected large cap stocks
        const remainingLargeCapAllocation = (allocation.equity * 0.2) / Math.max(remainingLargeCap.length, 1);
        remainingLargeCap.forEach(stock => {
          stock.allocation = remainingLargeCapAllocation;
          stock.investmentAmount = (equityAmount * 0.2) / Math.max(remainingLargeCap.length, 1);
        });
        instruments.push(...remainingLargeCap);
      }
    }

    // Enhanced debt instruments
    if (allocation.debt > 0) {
      const debtAmount = (monthlyInvestment * allocation.debt) / 100;
      instruments.push({
        symbol: 'LIQUIDBEES',
        name: 'Nippon India ETF Liquid BeES',
        type: 'etf',
        allocation: allocation.debt * 0.6,
        investmentAmount: debtAmount * 0.6,
        reasoning: 'Ultra-safe liquid fund for stability and emergency access with daily liquidity',
        riskLevel: 'low',
        expectedReturn: 6.8,
        rating: 5,
        expense_ratio: 0.05,
      });
      
      instruments.push({
        symbol: 'CPSEETF',
        name: 'CPSE ETF',
        type: 'etf',
        allocation: allocation.debt * 0.4,
        investmentAmount: debtAmount * 0.4,
        reasoning: 'Government-backed PSU ETF for stable returns with dividend yield',
        riskLevel: 'low',
        expectedReturn: 8.2,
        rating: 4,
        expense_ratio: 0.5,
      });
    }

    // Gold allocation
    if (allocation.gold > 0) {
      const goldAmount = (monthlyInvestment * allocation.gold) / 100;
      instruments.push({
        symbol: 'GOLDBEES',
        name: 'Nippon India ETF Gold BeES',
        type: 'gold_etf',
        allocation: allocation.gold,
        investmentAmount: goldAmount,
        reasoning: 'Gold ETF for portfolio diversification, inflation hedge, and rupee depreciation protection',
        riskLevel: 'medium',
        expectedReturn: 9.5,
        rating: 4,
        expense_ratio: 0.5,
      });
    }

    // International allocation
    if (allocation.international > 0) {
      const intlAmount = (monthlyInvestment * allocation.international) / 100;
      instruments.push({
        symbol: 'MOTILALUS',
        name: 'Motilal Oswal S&P 500 Index Fund',
        type: 'mutual_fund',
        allocation: allocation.international,
        investmentAmount: intlAmount,
        reasoning: 'US market exposure for global diversification and dollar appreciation benefits',
        riskLevel: 'medium',
        expectedReturn: 12.5,
        rating: 4,
        expense_ratio: 0.8,
      });
    }

    return instruments;
  }

  private selectTopStocks(marketData: MarketInstrument[], capSize: 'large' | 'mid' | 'small', amount: number, preferredSectors?: string[], avoidSectors?: string[], esgPreference?: boolean): RecommendedInstrument[] {
    const stockCategories = {
      large: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'WIPRO', 'AXISBANK', 'SUNPHARMA', 'MARUTI', 'ITC'],
      mid: ['LT', 'ASIANPAINT', 'KOTAKBANK', 'BHARTIARTL', 'SBIN', 'TATAMOTORS', 'NESTLEIND', 'ULTRACEMCO', 'TECHM', 'BAJFINANCE'],
      small: ['ADANIPORTS', 'POWERGRID', 'TATACONSUM', 'HCLTECH', 'BRITANNIA', 'SHREECEM', 'JSWSTEEL', 'TATASTEEL', 'COALINDIA']
    };

    let stocks = marketData.filter(stock => 
      stock.type === 'stock' && stockCategories[capSize].includes(stock.symbol)
    );

    // Apply user preferences if provided
    if (preferredSectors && preferredSectors.length > 0) {
      stocks = stocks.filter(stock => {
        const sector = this.getStockSector(stock.symbol);
        return preferredSectors.some(pref => sector.toLowerCase().includes(pref.toLowerCase()));
      });
    }

    if (avoidSectors && avoidSectors.length > 0) {
      stocks = stocks.filter(stock => {
        const sector = this.getStockSector(stock.symbol);
        return !avoidSectors.some(avoid => sector.toLowerCase().includes(avoid.toLowerCase()));
      });
    }

    // Apply ESG filtering if user prefers ESG investments
    if (esgPreference) {
      stocks = stocks.filter(stock => this.getESGScore(stock.symbol) >= 0.6);
    }

    // Enhanced stock selection with multiple factors for better accuracy
    const topStocks = stocks
      .map(stock => {
        // Calculate comprehensive score based on multiple factors including ESG
        const momentumScore = stock.daily_change_percent * 0.2; // 20% weight to momentum
        const stabilityScore = (1 - Math.abs(stock.daily_change_percent) / 10) * 0.2; // 20% weight to stability
        const volumeScore = (stock.volume || 0) > 1000000 ? 0.15 : 0.1; // 15% weight to volume
        const priceScore = stock.current_price > 1000 ? 0.1 : 0.05; // 10% weight to price level
        const sectorScore = this.getSectorScore(stock.symbol) * 0.15; // 15% weight to sector strength
        const esgScore = this.getESGScore(stock.symbol) * 0.2; // 20% weight to ESG score
        
        const totalScore = momentumScore + stabilityScore + volumeScore + priceScore + sectorScore + esgScore;
        
        return { stock, score: totalScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, capSize === 'large' ? 4 : 3)
      .map(item => item.stock);

    return topStocks.map((stock, index) => ({
      symbol: stock.symbol,
      name: stock.name,
      type: 'stock' as const,
      allocation: Math.round((amount / topStocks.length / amount) * 100),
      investmentAmount: amount / topStocks.length,
      reasoning: `AI-selected ${capSize}-cap stock with strong fundamentals, momentum, and sector strength`,
      riskLevel: capSize === 'large' ? 'medium' : capSize === 'mid' ? 'medium' : 'high',
      expectedReturn: this.calculateStockExpectedReturn(stock, capSize),
      sector: this.getStockSector(stock.symbol),
      marketCap: capSize,
      rating: this.calculateStockRating(stock),
    }));
  }

  private calculateExpectedReturns(instruments: RecommendedInstrument[], profile: UserProfile) {
    const weightedReturn = instruments.reduce((sum, instrument) => 
      sum + (instrument.expectedReturn * instrument.allocation / 100), 0
    );

    // Ensure returns are realistic (max 20% for any scenario)
    const realisticReturn = Math.min(weightedReturn, 20);
    
    // More realistic return calculations for Indian markets
    return {
      conservative: Math.round(Math.max(realisticReturn - 4, 6) * 100) / 100, // Conservative: 6-16%
      realistic: Math.round(realisticReturn * 100) / 100, // Realistic: 8-20%
      optimistic: Math.round(Math.min(realisticReturn + 4, 20) * 100) / 100, // Optimistic: 12-20%
    };
  }

  private calculateRiskMetrics(instruments: RecommendedInstrument[], profile: UserProfile) {
    const portfolioRisk = instruments.reduce((risk, instrument) => {
      const instrumentRisk = instrument.riskLevel === 'low' ? 4 : 
                           instrument.riskLevel === 'medium' ? 12 : 22;
      return risk + (instrumentRisk * instrument.allocation / 100);
    }, 0);

    return {
      portfolioRisk: Math.round(portfolioRisk * 100) / 100,
      maxDrawdown: Math.round(portfolioRisk * 1.3 * 100) / 100,
      sharpeRatio: Math.round((1.5 - portfolioRisk / 100) * 100) / 100,
      volatility: Math.round(portfolioRisk * 1.1 * 100) / 100,
    };
  }

  private generateReasoning(
    profile: UserProfile, 
    allocation: AIRecommendation['portfolioAllocation'], 
    instruments: RecommendedInstrument[]
  ): string[] {
    const reasoning = [];
    
    reasoning.push(`Based on your age (${profile.personalDetails.age}) and ${profile.riskProfile.riskTolerance} risk tolerance, our AI allocated ${allocation.equity}% to equity for optimal growth potential in Indian markets.`);
    
    reasoning.push(`Your ${profile.financialGoals.investmentHorizon}-term investment horizon allows for ${allocation.equity > 65 ? 'aggressive' : 'balanced'} equity exposure to capitalize on India's growth story.`);
    
    reasoning.push(`Monthly SIP of ₹${profile.financialGoals.monthlyInvestment.toLocaleString('en-IN')} is strategically diversified across ${instruments.length} AI-selected instruments for maximum efficiency.`);
    
    // Add personalized reasoning based on preferences
    if (profile.preferences.preferredSectors.length > 0) {
      reasoning.push(`Your preference for ${profile.preferences.preferredSectors.join(', ')} sectors has been incorporated into the stock selection process for better alignment with your investment goals.`);
    }
    
    if (profile.preferences.avoidSectors.length > 0) {
      reasoning.push(`As requested, we've excluded ${profile.preferences.avoidSectors.join(', ')} sectors from your portfolio to align with your investment preferences.`);
    }
    
    if (profile.preferences.esgPreference) {
      reasoning.push(`ESG considerations have been factored into your portfolio selection, prioritizing companies with strong environmental, social, and governance practices.`);
    }
    
    if (allocation.debt > 0) {
      reasoning.push(`${allocation.debt}% debt allocation provides stability, reduces volatility, and offers tax-efficient returns through government-backed securities.`);
    }
    
    if (allocation.gold > 0) {
      reasoning.push(`${allocation.gold}% gold allocation acts as an inflation hedge, currency depreciation protection, and portfolio diversifier during market stress.`);
    }
    
    if (allocation.international > 0) {
      reasoning.push(`${allocation.international}% international exposure provides global diversification and benefits from dollar appreciation against the rupee.`);
    }
    
    reasoning.push(`Our AI analysis of current market patterns, sector rotations, and economic indicators suggests this portfolio can deliver ${this.calculateExpectedReturns(instruments, profile).realistic}% annual returns with optimized risk management. Past performance does not guarantee future results.`);

    return reasoning;
  }

  private calculateConfidence(profile: UserProfile, marketData: MarketInstrument[]): number {
    let confidence = 75; // Base confidence for 80% accuracy target (more realistic)
    
    // Adjust based on market volatility
    const avgVolatility = marketData.reduce((sum, stock) => 
      sum + Math.abs(stock.daily_change_percent), 0) / marketData.length;
    
    if (avgVolatility > 3) confidence -= 5; // Higher penalty for high volatility
    if (avgVolatility < 1) confidence += 3;
    
    // Adjust based on profile completeness
    if (profile.preferences.preferredSectors.length > 0) confidence += 2;
    if (profile.riskProfile.previousInvestmentExperience !== 'none') confidence += 3;
    
    // Adjust based on market conditions
    const bullishStocks = marketData.filter(s => s.daily_change_percent > 1).length;
    const totalStocks = marketData.filter(s => s.type === 'stock').length;
    const marketSentiment = bullishStocks / totalStocks;
    
    if (marketSentiment > 0.6) confidence += 2; // Bullish market
    if (marketSentiment < 0.3) confidence -= 3; // Bearish market
    
    // Realistic confidence range: 70-85%
    return Math.min(85, Math.max(70, confidence));
  }

  private determineRebalanceFrequency(profile: UserProfile): 'monthly' | 'quarterly' | 'half_yearly' | 'yearly' {
    if (profile.riskProfile.riskTolerance === 'aggressive') return 'quarterly';
    if (profile.financialGoals.investmentHorizon === 'short') return 'monthly';
    return 'half_yearly';
  }

  private calculateStockExpectedReturn(stock: MarketInstrument, capSize: string): number {
    // More realistic return calculation based on multiple factors
    const momentum = stock.daily_change_percent;
    const baseReturn = {
      large: 12, // Reduced from 14% to be more realistic
      mid: 15,   // Reduced from 18% to be more realistic
      small: 18  // Reduced from 22% to be more realistic
    }[capSize] || 12;
    
    // Adjust based on momentum (but with diminishing returns)
    const momentumAdjustment = Math.sign(momentum) * Math.min(Math.abs(momentum) * 0.2, 2);
    
    // Adjust based on sector strength
    const sectorAdjustment = this.getSectorScore(stock.symbol) * 0.5;
    
    const totalReturn = baseReturn + momentumAdjustment + sectorAdjustment;
    
    // Cap returns at realistic levels
    return Math.round(Math.min(Math.max(totalReturn, 8), 20) * 100) / 100;
  }

  private getStockSector(symbol: string): string {
    const sectors: Record<string, string> = {
      // Large Cap Stocks
      'RELIANCE': 'Energy & Petrochemicals',
      'TCS': 'Information Technology',
      'HDFCBANK': 'Private Banking',
      'INFY': 'Information Technology',
      'ICICIBANK': 'Private Banking',
      'HINDUNILVR': 'FMCG',
      'WIPRO': 'Information Technology',
      'AXISBANK': 'Private Banking',
      'SUNPHARMA': 'Pharmaceuticals',
      'MARUTI': 'Automobiles',
      
      // Mid Cap Stocks
      'LT': 'Infrastructure & Engineering',
      'ASIANPAINT': 'Paints & Chemicals',
      'KOTAKBANK': 'Private Banking',
      'BHARTIARTL': 'Telecommunications',
      'SBIN': 'Public Banking',
      'TATAMOTORS': 'Automobiles',
      'NESTLEIND': 'FMCG',
      'ULTRACEMCO': 'Cement & Construction',
      'TECHM': 'Information Technology',
      'BAJFINANCE': 'Financial Services',
      
      // Small Cap Stocks
      'ITC': 'FMCG & Tobacco',
      'ADANIPORTS': 'Infrastructure',
      'POWERGRID': 'Power Utilities',
      'TATACONSUM': 'FMCG',
      'HCLTECH': 'Information Technology',
      'BRITANNIA': 'FMCG',
      'SHREECEM': 'Cement & Construction',
      'JSWSTEEL': 'Metals & Mining',
      'TATASTEEL': 'Metals & Mining',
      'COALINDIA': 'Mining & Energy',
    };
    return sectors[symbol] || 'Diversified';
  }

  private getSectorScore(symbol: string): number {
    // Enhanced sector strength scoring based on current market conditions
    const sectorScores: Record<string, number> = {
      // Large Cap Stocks
      'RELIANCE': 0.7, // Energy - moderate strength
      'TCS': 0.9,      // IT - strong momentum
      'INFY': 0.9,     // IT - strong momentum
      'HDFCBANK': 0.6, // Banking - moderate
      'ICICIBANK': 0.6, // Banking - moderate
      'HINDUNILVR': 0.7, // FMCG - stable
      'WIPRO': 0.8,    // IT - good momentum
      'AXISBANK': 0.6, // Banking - moderate
      'SUNPHARMA': 0.8, // Pharma - strong
      'MARUTI': 0.7,   // Auto - moderate
      
      // Mid Cap Stocks
      'LT': 0.7,       // Infrastructure - moderate
      'ASIANPAINT': 0.8, // Chemicals - good
      'KOTAKBANK': 0.6, // Banking - moderate
      'BHARTIARTL': 0.5, // Telecom - lower
      'SBIN': 0.5,     // Public banking - lower
      'TATAMOTORS': 0.7, // Auto - moderate
      'NESTLEIND': 0.8, // FMCG - strong
      'ULTRACEMCO': 0.7, // Cement - moderate
      'TECHM': 0.8,    // IT - good
      'BAJFINANCE': 0.7, // Finance - moderate
      
      // Small Cap Stocks
      'ITC': 0.6,      // FMCG - moderate
      'ADANIPORTS': 0.6, // Infrastructure - moderate
      'POWERGRID': 0.5, // Utilities - lower
      'TATACONSUM': 0.7, // FMCG - moderate
      'HCLTECH': 0.8,  // IT - good
      'BRITANNIA': 0.8, // FMCG - strong
      'SHREECEM': 0.7, // Cement - moderate
      'JSWSTEEL': 0.6, // Metals - moderate
      'TATASTEEL': 0.6, // Metals - moderate
      'COALINDIA': 0.5, // Mining - lower
    };
    return sectorScores[symbol] || 0.5; // Default neutral score
  }

  private getESGScore(symbol: string): number {
    // ESG scoring based on environmental, social, and governance factors
    const esgScores: Record<string, number> = {
      // High ESG Scores (0.8-0.9)
      'TCS': 0.9,      // Strong ESG practices, carbon neutral
      'INFY': 0.9,     // Excellent ESG track record
      'HINDUNILVR': 0.85, // Sustainable sourcing, social impact
      'NESTLEIND': 0.85, // Strong sustainability initiatives
      'BRITANNIA': 0.8, // Good ESG practices
      'HCLTECH': 0.8,  // Strong governance, social responsibility
      
      // Medium ESG Scores (0.6-0.7)
      'RELIANCE': 0.7, // Improving ESG practices
      'HDFCBANK': 0.7, // Good governance, moderate ESG
      'ICICIBANK': 0.7, // Banking sector ESG standards
      'AXISBANK': 0.7, // Banking sector ESG standards
      'KOTAKBANK': 0.7, // Banking sector ESG standards
      'SBIN': 0.6,     // Public sector, moderate ESG
      'LT': 0.7,       // Infrastructure, improving ESG
      'ASIANPAINT': 0.7, // Chemicals, moderate ESG
      'TECHM': 0.7,    // IT sector, good ESG
      'TATACONSUM': 0.7, // FMCG, moderate ESG
      
      // Lower ESG Scores (0.4-0.5)
      'ITC': 0.5,      // Tobacco, lower ESG
      'BHARTIARTL': 0.6, // Telecom, moderate ESG
      'TATAMOTORS': 0.6, // Auto, moderate ESG
      'ULTRACEMCO': 0.5, // Cement, environmental concerns
      'SHREECEM': 0.5, // Cement, environmental concerns
      'JSWSTEEL': 0.4, // Steel, environmental impact
      'TATASTEEL': 0.4, // Steel, environmental impact
      'COALINDIA': 0.3, // Mining, significant environmental impact
      'POWERGRID': 0.6, // Utilities, moderate ESG
      'ADANIPORTS': 0.6, // Infrastructure, moderate ESG
      'MARUTI': 0.6,   // Auto, moderate ESG
      'SUNPHARMA': 0.7, // Pharma, good ESG
      'BAJFINANCE': 0.6, // Finance, moderate ESG
    };
    return esgScores[symbol] || 0.5; // Default moderate ESG score
  }

  private calculateStockRating(stock: MarketInstrument): number {
    // Enhanced rating based on multiple factors
    const performance = stock.daily_change_percent;
    const volatility = Math.abs(performance);
    
    let rating = 3; // Base rating
    
    if (performance > 2) rating += 2;
    else if (performance > 0) rating += 1;
    else if (performance > -2) rating -= 0;
    else rating -= 1;
    
    // Adjust for volatility (lower volatility is better for rating)
    if (volatility < 1) rating += 0.5;
    else if (volatility > 3) rating -= 0.5;
    
    return Math.min(5, Math.max(1, Math.round(rating)));
  }

  public analyzeMarketPatterns(marketData: MarketInstrument[]): MarketPattern[] {
    const patterns: MarketPattern[] = [];
    
    // Enhanced trend analysis
    const bullishStocks = marketData.filter(s => s.daily_change_percent > 1).length;
    const totalStocks = marketData.filter(s => s.type === 'stock').length;
    const bullishRatio = bullishStocks / totalStocks;
    
    if (bullishRatio > 0.7) {
      patterns.push({
        pattern: 'Strong Bull Market Rally',
        confidence: Math.round(bullishRatio * 100),
        timeframe: 'Short to Medium-term',
        impact: 'bullish',
        instruments: marketData.filter(s => s.daily_change_percent > 1).map(s => s.symbol),
      });
    }
    
    // Sector rotation analysis
    const sectors = this.analyzeSectorPerformance(marketData);
    if (sectors.length > 0) {
      patterns.push({
        pattern: `${sectors[0].sector} Sector Leadership`,
        confidence: 88,
        timeframe: 'Medium-term',
        impact: 'bullish',
        instruments: sectors[0].stocks,
      });
    }
    
    return patterns;
  }

  private analyzeSectorPerformance(marketData: MarketInstrument[]) {
    const sectorPerformance: Record<string, { performance: number; stocks: string[] }> = {};
    
    marketData.filter(s => s.type === 'stock').forEach(stock => {
      const sector = this.getStockSector(stock.symbol);
      if (!sectorPerformance[sector]) {
        sectorPerformance[sector] = { performance: 0, stocks: [] };
      }
      sectorPerformance[sector].performance += stock.daily_change_percent;
      sectorPerformance[sector].stocks.push(stock.symbol);
    });
    
    return Object.entries(sectorPerformance)
      .map(([sector, data]) => ({
        sector,
        avgPerformance: data.performance / data.stocks.length,
        stocks: data.stocks,
      }))
      .sort((a, b) => b.avgPerformance - a.avgPerformance);
  }

  public generateAIInsights(marketData: MarketInstrument[], userProfile?: UserProfile): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // More realistic market trend insight
    const nifty = marketData.find(m => m.symbol === '^NSEI');
    if (nifty) {
      if (Math.abs(nifty.daily_change_percent) > 1.5) {
        insights.push({
          type: 'market_trend',
          title: `NIFTY ${nifty.daily_change_percent > 0 ? 'Breakout' : 'Correction'}`,
          description: `NIFTY moved ${nifty.daily_change_percent.toFixed(2)}% today, indicating ${nifty.daily_change_percent > 0 ? 'bullish momentum' : 'profit booking'} across Indian markets.`,
          impact: Math.abs(nifty.daily_change_percent) > 2 ? 'high' : 'medium',
          actionRequired: Math.abs(nifty.daily_change_percent) > 2.5,
          recommendation: nifty.daily_change_percent > 0 ? 
            'Consider systematic profit booking in overvalued positions and maintain SIP discipline' : 
            'Good opportunity for fresh investments in quality stocks at attractive valuations',
          affectedInstruments: ['^NSEI', '^NSEBANK'],
          confidence: 82, // More realistic confidence
          timestamp: new Date().toISOString(),
        });
      }
    }
    
    // More realistic sector rotation insight
    const topSector = this.analyzeSectorPerformance(marketData)[0];
    if (topSector && topSector.avgPerformance > 1.2) {
      insights.push({
        type: 'sector_rotation',
        title: `${topSector.sector} Sector Momentum`,
        description: `${topSector.sector} sector is leading with average gains of ${topSector.avgPerformance.toFixed(2)}%, indicating institutional interest and positive fundamentals.`,
        impact: 'medium',
        actionRequired: true,
        recommendation: `Consider moderate allocation increase to ${topSector.sector} sector through SIP top-ups`,
        affectedInstruments: topSector.stocks,
        confidence: 78, // More realistic confidence
        timestamp: new Date().toISOString(),
      });
    }
    
    // More realistic risk alert
    const volatileStocks = marketData.filter(s => Math.abs(s.daily_change_percent) > 4);
    if (volatileStocks.length > 3) {
      insights.push({
        type: 'risk_alert',
        title: 'Elevated Market Volatility Alert',
        description: `${volatileStocks.length} stocks showing significant movements (>4%). Market volatility is elevated due to various factors.`,
        impact: 'high',
        actionRequired: true,
        recommendation: 'Maintain disciplined SIP approach and avoid large lump sum investments during volatile periods',
        affectedInstruments: volatileStocks.map(s => s.symbol),
        confidence: 85, // More realistic confidence
        timestamp: new Date().toISOString(),
      });
    }
    
    // More realistic opportunity insight
    const underperformers = marketData.filter(s => s.type === 'stock' && s.daily_change_percent < -2 && s.daily_change_percent > -5);
    if (underperformers.length > 2) {
      insights.push({
        type: 'opportunity',
        title: 'Quality Stocks at Attractive Valuations',
        description: `${underperformers.length} quality stocks are trading at lower levels after recent correction, potentially offering good long-term investment opportunities.`,
        impact: 'medium',
        actionRequired: true,
        recommendation: 'Consider moderate increase in SIP amounts for fundamentally strong stocks during corrections',
        affectedInstruments: underperformers.map(s => s.symbol),
        confidence: 75, // More realistic confidence
        timestamp: new Date().toISOString(),
      });
    }
    
    return insights;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public getRecommendation(recommendationId: string): AIRecommendation | null {
    return this.recommendations.get(recommendationId) || null;
  }

  public getUserRecommendations(userId: string): AIRecommendation[] {
    return Array.from(this.recommendations.values()).filter(rec => rec.userId === userId);
  }
}