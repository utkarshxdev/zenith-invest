import React, { useState, useEffect } from 'react';
import { UserProfile, AIRecommendation, AIInsight } from '../types/investment';
import { MarketInstrument } from '../types/market';
import { AIInvestmentService } from '../services/aiInvestmentService';
import { Brain, TrendingUp, Shield, Target, Star, AlertTriangle, Lightbulb, RefreshCw, PieChart, ArrowLeft, Download, Share2 } from 'lucide-react';

interface AIRecommendationDashboardProps {
  userProfile: UserProfile;
  marketData: MarketInstrument[];
  onBack: () => void;
}

const AIRecommendationDashboard: React.FC<AIRecommendationDashboardProps> = ({ 
  userProfile, 
  marketData, 
  onBack 
}) => {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'insights' | 'performance'>('portfolio');

  const aiService = AIInvestmentService.getInstance();

  useEffect(() => {
    generateRecommendation();
  }, [userProfile, marketData]);

  const generateRecommendation = async () => {
    setIsLoading(true);
    try {
      const rec = await aiService.generateAIRecommendation(userProfile.id, marketData);
      const aiInsights = aiService.generateAIInsights(marketData, userProfile);
      
      setRecommendation(rec);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Error generating recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-8 border-purple-500/20 rounded-full animate-spin border-t-purple-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-12 h-12 text-purple-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">AI is Crafting Your Perfect Portfolio</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            Analyzing your profile, market conditions, and financial factors to create 
            your personalized investment strategy with realistic expectations...
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <span>Risk Assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span>Market Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <span>Portfolio Optimization</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Unable to Generate Recommendation</h2>
          <p className="text-gray-400 mb-8">Please try again or contact support</p>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:scale-105 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 85) return 'Very High';
    if (confidence >= 75) return 'High';
    if (confidence >= 65) return 'Medium';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Your AI Investment Strategy</h1>
                  <p className="text-purple-200">Personalized for {userProfile.personalDetails.name}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">AI Analysis Confidence</p>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          recommendation.confidence >= 85 ? 'bg-green-400' :
                          recommendation.confidence >= 75 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${recommendation.confidence}%` }}
                      ></div>
                    </div>
                    <span className={`text-2xl font-bold ${getConfidenceColor(recommendation.confidence)}`}>
                      {recommendation.confidence}%
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">({getConfidenceLabel(recommendation.confidence)})</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={generateRecommendation}
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Tabs */}
          <div className="flex space-x-2 bg-slate-800/50 rounded-xl p-2">
            {[
              { id: 'portfolio', label: 'Your Portfolio', icon: PieChart },
              { id: 'insights', label: 'AI Insights', icon: Lightbulb },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Target className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-green-300 text-sm">Monthly Investment</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(userProfile.financialGoals.monthlyInvestment)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-blue-300 text-sm">Expected Return</p>
                    <p className="text-2xl font-bold text-white">{recommendation.expectedReturns.realistic}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-purple-300 text-sm">Risk Level</p>
                    <p className="text-2xl font-bold text-white">{recommendation.riskMetrics.portfolioRisk.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-yellow-300 text-sm">AI Rating</p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(recommendation.confidence / 20) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Allocation Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-3">
                  <PieChart className="w-6 h-6 text-purple-400" />
                  <span>Asset Allocation</span>
                </h3>
                
                <div className="space-y-6">
                  {Object.entries(recommendation.portfolioAllocation).map(([asset, percentage]) => {
                    const colors = {
                      equity: 'bg-blue-500',
                      debt: 'bg-green-500',
                      gold: 'bg-yellow-500',
                      international: 'bg-purple-500',
                      cash: 'bg-gray-500'
                    };
                    
                    return (
                      <div key={asset} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${colors[asset as keyof typeof colors]}`}></div>
                            <span className="text-gray-300 capitalize font-medium">{asset}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-bold text-lg">{percentage}%</span>
                            <div className="text-sm text-gray-400">
                              {formatCurrency((userProfile.financialGoals.monthlyInvestment * percentage) / 100)}
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colors[asset as keyof typeof colors]} transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Expected Returns */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-3">
                  <Target className="w-6 h-6 text-green-400" />
                  <span>Return Projections</span>
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-green-300 font-medium">Conservative</span>
                    <span className="text-green-400 font-bold text-xl">{recommendation.expectedReturns.conservative}% p.a.</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <span className="text-blue-300 font-medium">Realistic</span>
                    <span className="text-blue-400 font-bold text-xl">{recommendation.expectedReturns.realistic}% p.a.</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <span className="text-purple-300 font-medium">Optimistic</span>
                    <span className="text-purple-400 font-bold text-xl">{recommendation.expectedReturns.optimistic}% p.a.</span>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl">
                  <p className="text-sm text-blue-200 mb-2">Projected Portfolio Value (10 years)</p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(
                      userProfile.financialGoals.monthlyInvestment * 12 * 10 * 
                      (1 + recommendation.expectedReturns.realistic / 100)
                    )}
                  </p>
                                  <p className="text-sm text-gray-400 mt-1">
                  Based on {recommendation.expectedReturns.realistic}% annual returns (past performance doesn't guarantee future results)
                </p>
                </div>
              </div>
            </div>

            {/* Recommended Instruments */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
                <Star className="w-6 h-6 text-yellow-400" />
                <span>AI-Recommended Investments</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendation.recommendedInstruments.map((instrument, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:border-purple-500/50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-white text-lg">{instrument.symbol}</h4>
                        <p className="text-sm text-gray-400 truncate">{instrument.name}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < instrument.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Allocation:</span>
                        <span className="text-white font-semibold">{instrument.allocation}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Amount:</span>
                        <span className="text-white font-semibold">{formatCurrency(instrument.investmentAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Return:</span>
                        <span className="text-green-400 font-semibold">{instrument.expectedReturn}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className={`font-semibold ${
                          instrument.riskLevel === 'low' ? 'text-green-400' :
                          instrument.riskLevel === 'medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {instrument.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-slate-600/50 rounded-lg">
                      <p className="text-xs text-gray-300 leading-relaxed">{instrument.reasoning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-3">
                <Brain className="w-6 h-6 text-purple-400" />
                <span>AI Strategy Explanation</span>
              </h3>
              
              <div className="space-y-4">
                {recommendation.reasoning.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <span>AI Market Insights & Recommendations</span>
            </h3>
            
            {insights.length === 0 ? (
              <div className="text-center py-16">
                <Lightbulb className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                <h4 className="text-xl font-semibold text-white mb-2">No Critical Insights Right Now</h4>
                <p className="text-gray-400">Market conditions are stable. We'll notify you of any important changes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {insights.map((insight, index) => (
                  <div key={index} className={`
                    bg-slate-800/50 backdrop-blur-sm border rounded-xl p-6 hover:scale-105 transition-all duration-300
                    ${insight.impact === 'high' ? 'border-red-500/30 bg-red-900/10' :
                      insight.impact === 'medium' ? 'border-yellow-500/30 bg-yellow-900/10' :
                      'border-green-500/30 bg-green-900/10'
                    }
                  `}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl ${
                          insight.type === 'market_trend' ? 'bg-blue-500/20 text-blue-400' :
                          insight.type === 'sector_rotation' ? 'bg-purple-500/20 text-purple-400' :
                          insight.type === 'risk_alert' ? 'bg-red-500/20 text-red-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {insight.type === 'market_trend' && <TrendingUp className="w-5 h-5" />}
                          {insight.type === 'sector_rotation' && <RefreshCw className="w-5 h-5" />}
                          {insight.type === 'risk_alert' && <AlertTriangle className="w-5 h-5" />}
                          {insight.type === 'opportunity' && <Target className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg">{insight.title}</h4>
                          <p className="text-xs text-gray-400 capitalize">{insight.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                          insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {insight.impact.toUpperCase()} IMPACT
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{insight.confidence}% confidence</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4 leading-relaxed">{insight.description}</p>
                    
                    {insight.recommendation && (
                      <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                        <p className="text-xs text-gray-400 mb-2">💡 AI Recommendation:</p>
                        <p className="text-sm text-white font-medium">{insight.recommendation}</p>
                      </div>
                    )}
                    
                    {insight.affectedInstruments.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Affected Instruments:</p>
                        <div className="flex flex-wrap gap-2">
                          {insight.affectedInstruments.slice(0, 5).map((symbol, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-slate-600 text-gray-300 rounded-full">
                              {symbol}
                            </span>
                          ))}
                          {insight.affectedInstruments.length > 5 && (
                            <span className="text-xs px-2 py-1 bg-slate-600 text-gray-300 rounded-full">
                              +{insight.affectedInstruments.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-400" />
              <span>Risk & Performance Analysis</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-10 h-10 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white">Portfolio Risk</h4>
                    <p className="text-sm text-blue-200">Overall risk level</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-400">{recommendation.riskMetrics.portfolioRisk}%</p>
                <p className="text-xs text-gray-400 mt-2">Lower is safer</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-10 h-10 text-green-400" />
                  <div>
                    <h4 className="font-bold text-white">Sharpe Ratio</h4>
                    <p className="text-sm text-green-200">Risk-adjusted return</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-400">{recommendation.riskMetrics.sharpeRatio}</p>
                <p className="text-xs text-gray-400 mt-2">Higher is better</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                  <div>
                    <h4 className="font-bold text-white">Max Drawdown</h4>
                    <p className="text-sm text-red-200">Worst-case scenario</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-red-400">{recommendation.riskMetrics.maxDrawdown}%</p>
                <p className="text-xs text-gray-400 mt-2">Maximum potential loss</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <RefreshCw className="w-10 h-10 text-purple-400" />
                  <div>
                    <h4 className="font-bold text-white">Volatility</h4>
                    <p className="text-sm text-purple-200">Price fluctuation</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-purple-400">{recommendation.riskMetrics.volatility}%</p>
                <p className="text-xs text-gray-400 mt-2">Expected price swings</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <h4 className="text-xl font-bold text-white mb-6">Rebalancing & Monitoring Strategy</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="font-semibold text-white mb-2">Rebalance Frequency</h5>
                  <p className="text-purple-400 font-medium capitalize">{recommendation.rebalanceFrequency.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-400 mt-1">Optimal for your strategy</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="font-semibold text-white mb-2">Next Review</h5>
                  <p className="text-blue-400 font-medium">
                    {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Quarterly assessment</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="font-semibold text-white mb-2">Strategy Valid Until</h5>
                  <p className="text-green-400 font-medium">
                    {new Date(recommendation.validUntil).toLocaleDateString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">30-day validity</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIRecommendationDashboard;