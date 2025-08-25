import React, { useState } from 'react';
import { UserProfile } from '../types/investment';
import { AIInvestmentService } from '../services/aiInvestmentService';
import { Brain, User, Target, Shield, TrendingUp, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface AIInvestmentWizardProps {
  onComplete: (profile: UserProfile) => void;
  onClose: () => void;
}

const AIInvestmentWizard: React.FC<AIInvestmentWizardProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    name: '',
    age: 25,
    occupation: '',
    monthlyIncome: 50000,
    currentSavings: 100000,
    dependents: 0,
    
    // Financial Goals
    investmentHorizon: 'medium' as const,
    primaryGoal: 'wealth_creation' as const,
    targetAmount: 1000000,
    monthlyInvestment: 10000,
    
    // Risk Profile
    riskTolerance: 'moderate' as const,
    riskScore: 5,
    volatilityComfort: 5,
    previousInvestmentExperience: 'basic' as const,
    
    // Preferences
    preferredSectors: [] as string[],
    avoidSectors: [] as string[],
    esgPreference: false,
    taxSavingPreference: true,
  });

  const aiService = AIInvestmentService.getInstance();

  const steps = [
    { id: 1, title: 'Personal Details', icon: User },
    { id: 2, title: 'Financial Goals', icon: Target },
    { id: 3, title: 'Risk Assessment', icon: Shield },
    { id: 4, title: 'Preferences', icon: TrendingUp },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const profile = aiService.createUserProfile({
      personalDetails: {
        name: formData.name,
        age: formData.age,
        occupation: formData.occupation,
        monthlyIncome: formData.monthlyIncome,
        currentSavings: formData.currentSavings,
        dependents: formData.dependents,
      },
      financialGoals: {
        investmentHorizon: formData.investmentHorizon,
        primaryGoal: formData.primaryGoal,
        targetAmount: formData.targetAmount,
        monthlyInvestment: formData.monthlyInvestment,
      },
      riskProfile: {
        riskTolerance: formData.riskTolerance,
        riskScore: formData.riskScore,
        volatilityComfort: formData.volatilityComfort,
        previousInvestmentExperience: formData.previousInvestmentExperience,
      },
      preferences: {
        preferredSectors: formData.preferredSectors,
        avoidSectors: formData.avoidSectors,
        esgPreference: formData.esgPreference,
        taxSavingPreference: formData.taxSavingPreference,
      },
    });

    onComplete(profile);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSector = (sector: string, type: 'preferred' | 'avoid') => {
    const field = type === 'preferred' ? 'preferredSectors' : 'avoidSectors';
    const currentSectors = formData[field];
    
    if (currentSectors.includes(sector)) {
      updateFormData(field, currentSectors.filter(s => s !== sector));
    } else {
      updateFormData(field, [...currentSectors, sector]);
    }
  };

  const sectors = ['Technology', 'Banking', 'Healthcare', 'Energy', 'FMCG', 'Infrastructure', 'Telecom', 'Automotive'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Investment Advisor</h2>
                <p className="text-gray-400">Let AI create your personalized investment strategy</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                  ${currentStep >= step.id 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : 'bg-slate-700 text-gray-400'
                  }
                `}>
                  <step.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-600 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="18"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => updateFormData('occupation', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Software Engineer, Doctor, Business Owner"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => updateFormData('monthlyIncome', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Savings (₹)</label>
                  <input
                    type="number"
                    value={formData.currentSavings}
                    onChange={(e) => updateFormData('currentSavings', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    step="10000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Dependents</label>
                  <input
                    type="number"
                    value={formData.dependents}
                    onChange={(e) => updateFormData('dependents', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    max="10"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Financial Goals</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Investment Horizon</label>
                  <select
                    value={formData.investmentHorizon}
                    onChange={(e) => updateFormData('investmentHorizon', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="short">Short-term (1-3 years)</option>
                    <option value="medium">Medium-term (3-7 years)</option>
                    <option value="long">Long-term (7+ years)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Goal</label>
                  <select
                    value={formData.primaryGoal}
                    onChange={(e) => updateFormData('primaryGoal', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="wealth_creation">Wealth Creation</option>
                    <option value="retirement">Retirement Planning</option>
                    <option value="child_education">Child's Education</option>
                    <option value="home_purchase">Home Purchase</option>
                    <option value="emergency_fund">Emergency Fund</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Target Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => updateFormData('targetAmount', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    step="100000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Investment (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyInvestment}
                    onChange={(e) => updateFormData('monthlyInvestment', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="500"
                    step="500"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Risk Assessment</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Risk Tolerance</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'conservative', label: 'Conservative', desc: 'Prefer stable returns' },
                      { value: 'moderate', label: 'Moderate', desc: 'Balanced approach' },
                      { value: 'aggressive', label: 'Aggressive', desc: 'High growth potential' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFormData('riskTolerance', option.value)}
                        className={`
                          p-4 rounded-lg border-2 transition-all text-left
                          ${formData.riskTolerance === option.value
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-slate-600 bg-slate-700 text-gray-300 hover:border-slate-500'
                          }
                        `}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-400">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Risk Score (1-10): {formData.riskScore}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.riskScore}
                    onChange={(e) => updateFormData('riskScore', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Very Low</span>
                    <span>Very High</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Investment Experience</label>
                  <select
                    value={formData.previousInvestmentExperience}
                    onChange={(e) => updateFormData('previousInvestmentExperience', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="none">No prior experience</option>
                    <option value="basic">Basic (FD, Savings)</option>
                    <option value="intermediate">Intermediate (Mutual Funds)</option>
                    <option value="advanced">Advanced (Stocks, Options)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Investment Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Sectors</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sectors.map((sector) => (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector, 'preferred')}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${formData.preferredSectors.includes(sector)
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                          }
                        `}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Sectors to Avoid</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sectors.map((sector) => (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector, 'avoid')}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${formData.avoidSectors.includes(sector)
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                          }
                        `}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">ESG Investing</label>
                    <p className="text-xs text-gray-400">Prefer environmentally and socially responsible investments</p>
                  </div>
                  <button
                    onClick={() => updateFormData('esgPreference', !formData.esgPreference)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${formData.esgPreference ? 'bg-green-500' : 'bg-slate-600'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${formData.esgPreference ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Tax Saving Priority</label>
                    <p className="text-xs text-gray-400">Include ELSS and tax-saving instruments</p>
                  </div>
                  <button
                    onClick={() => updateFormData('taxSavingPreference', !formData.taxSavingPreference)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${formData.taxSavingPreference ? 'bg-green-500' : 'bg-slate-600'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${formData.taxSavingPreference ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
              ${currentStep === 1
                ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                : 'bg-slate-700 text-white hover:bg-slate-600'
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <div className="text-sm text-gray-400">
            Step {currentStep} of {steps.length}
          </div>
          
          <button
            onClick={handleNext}
            disabled={currentStep === 1 && !formData.name}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{currentStep === 4 ? 'Generate AI Strategy' : 'Next'}</span>
            {currentStep === 4 ? <CheckCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInvestmentWizard;